from rest_framework import serializers
from .models import Level

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = [
            'id',
            'level',
            'level_name',
            'display_name',
            'experience',
            'color',
            'color_wheel',
            'icon',
            'is_active',
        ]