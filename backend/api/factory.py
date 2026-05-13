
import factory
from django.contrib.auth.models import User
from .models import Level, User_Level, UserLevelInstance, UserProfile


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    password = factory.PostGenerationMethodCall('set_password', 'password123')


class LevelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Level

    level = factory.Sequence(lambda n: n)
    level_name = factory.Sequence(lambda n: f"Level {n}")
    display_name = factory.LazyAttribute(lambda o: o.level_name)


class UserLevelConfigFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User_Level

    level = factory.SubFactory(LevelFactory)
    min_accuracy = 80.0
    max_keystrokes = 150
    stars = 1  # not really used in your logic
    is_active = 1