from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import ChatBotMessages
from rest_framework.response import Response
from .serializers import ChatBotMessageSerializer
from rest_framework import status
import environ
import openai
from django.forms import ValidationError
from llama_cpp import Llama
import os


env = environ.Env()
environ.Env.read_env()

# Access the OpenAI key
OPENAI_KEY = env('OpenAIKey')
openai.api_key = OPENAI_KEY

# Create your views here.


class ChatBotMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def ask_openai(self, prompt_message):
        completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an helpful assistant."},
                {"role": "user", "content": prompt_message}
            ]
        )

        answer = completion.choices[0].message.content.strip()
        return answer

    def ask_llama(self, prompt_message):

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))

        # Construct the relative path to the model file
        llm_model_path = os.path.join(
            BASE_DIR, 'aimodels', 'mistral-7b-openorca.Q3_K_M.gguf')

        llm = Llama(model_path=llm_model_path,
                    n_gpu_layers=1, n_ctx=500)

        prompt = f"""<|im_start|>system
        You are a helpful chatbot.
        <|im_end|>
        <|im_start|>user
        {prompt_message}<|im_end|>
        <|im_start|>assistant"""

        output = llm.create_completion(prompt, max_tokens=4069,  stop=[
                                       "<|im_end|>"], stream=False)
        # print(output["choices"][0]["text"])
        generated_message = output["choices"][0]["text"]

        # for token in output:
        #     generated_message += token["choices"][0]["text"]
        #     print(token["choices"][0]["text"], end='', flush=True)

        return generated_message

    def get(self, request):
        messages = ChatBotMessages.objects.filter(
            writer=request.user).order_by('-created_at')[:10]

        serializer = ChatBotMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        writer = request.user

        content = request.data.get('content', '').strip()

        if not content:
            raise ValidationError("Message content is required")

        response_from_openai = self.ask_llama(content)

        # Create a new message
        message = ChatBotMessages.objects.create(
            writer=writer,
            message=content,
            response=response_from_openai
        )

        # Serialize the code before saving
        serialized_data = message.serialize_code()
        message.save()

        serializer = ChatBotMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
