from django import forms
from django.contrib.auth.models import User
from todoapp.models import UserProfile,TodoList


class SignupForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput())
	class Meta:
		model = User
		fields = ['username','first_name','last_name','email','password']

class ProfileForm(forms.ModelForm):
	class Meta:
		model = UserProfile
		fields = ['city','profpic','mobile']

class TodoListForm(forms.ModelForm):
	class Meta:
		model = TodoList
		fields = ['title']