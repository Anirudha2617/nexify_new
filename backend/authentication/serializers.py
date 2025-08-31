from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creation of new User instances.
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with that email already exists.")]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, required=True, label='Confirm Password'
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }    

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            print("Validation Error: Password fields didn't match.")  # <--- Added print statement
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Add a print statement to show the data being validated
        print("Data being validated:", attrs)
        
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# authentication/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    isOnline = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "name", "avatar", "isOnline")

    def get_name(self, obj):
        # If first and last name available, use them
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        # Otherwise fallback to username
        return obj.username

    def get_avatar(self, obj):
        # Example: Use dicebear avatar generator from username
        return f"https://api.dicebear.com/6.x/initials/svg?seed={obj.username}"

    def get_isOnline(self, obj):
        # Always False for now, can connect with WebSocket/Redis later
        return False


