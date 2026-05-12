from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import UserProgress


class RegisterTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@test.com'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_register_no_email_success(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_register_missing_username(self):
        response = self.client.post('/api/auth/register/', {
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_register_missing_password(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'testuser'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_register_only_email(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'test@test.com'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_register_username_email(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'testuser',
            'email': 'test@test.com'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_register_email_password(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'test@test.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_register_duplicate_username(self):
        User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post('/api/auth/register/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username already taken')


class UserDetailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@test.com'
        )

    def test_me_unauthenticated(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_user_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@test.com')
        self.assertEqual(response.data['id'], self.user.id)


class ProgressTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_get_progress_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/progress/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_progress_empty(self):
        response = self.client.get('/api/progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {})

    def test_get_progress_creates_record(self):
        self.client.get('/api/progress/')
        self.assertTrue(UserProgress.objects.filter(user=self.user).exists())

    def test_save_level(self):
        payload = {'level': 3, 'score': 450}
        response = self.client.post('/api/progress/save/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'saved')

    def test_save_level_persists(self):
        payload = {'level': 3, 'score': 450}
        self.client.post('/api/progress/save/', payload, format='json')
        progress = UserProgress.objects.get(user=self.user)
        self.assertEqual(progress.data['level'], 3)
        self.assertEqual(progress.data['score'], 450)

    def test_save_level_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/progress/save/', {'level': 1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BackendTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.me_url = "/api/auth/me/"
        self.progress_url = "/api/progress/"
        self.save_progress_url = "/api/progress/save/"

        self.user_data = {
            "username": "testuser",
            "password": "testpass123",
            "email": "testuser@test.com"
        }

    def register_user(self):
        return self.client.post(
            self.register_url,
            self.user_data,
            format="json"
        )

    def login_user(self):
        return self.client.post(
            self.login_url,
            {
                "username": self.user_data["username"],
                "password": self.user_data["password"]
            },
            format="json"
        )

    def authenticate_user(self):
        register_response = self.register_user()
        access_token = register_response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        return access_token

    def test_register_user_success(self):
        response = self.register_user()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertTrue(
            User.objects.filter(username=self.user_data["username"]).exists()
        )

    def test_register_user_missing_username(self):
        response = self.client.post(
            self.register_url,
            {
                "password": self.user_data["password"],
                "email": self.user_data["email"]
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_register_user_missing_password(self):
        response = self.client.post(
            self.register_url,
            {
                "username": self.user_data["username"],
                "email": self.user_data["email"]
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_register_duplicate_username(self):
        first_response = self.register_user()
        second_response = self.register_user()

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", second_response.data)

    def test_login_user_success(self):
        self.register_user()

        response = self.login_user()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        self.register_user()

        response = self.client.post(
            self.login_url,
            {
                "username": self.user_data["username"],
                "password": "wrongpassword"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_login(self):
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_logged_in_user(self):
        self.authenticate_user()

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user_data["username"])
        self.assertEqual(response.data["email"], self.user_data["email"])

    def test_get_progress_requires_login(self):
        response = self.client.get(self.progress_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_progress_starts_empty(self):
        self.authenticate_user()
        user = User.objects.get(username=self.user_data["username"])

        response = self.client.get(self.progress_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {})
        self.assertTrue(UserProgress.objects.filter(user=user).exists())

    def test_save_progress_requires_login(self):
        response = self.client.post(
            self.save_progress_url,
            {
                "level1": True
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_save_progress_success(self):
        self.authenticate_user()
        user = User.objects.get(username=self.user_data["username"])

        response = self.client.post(
            self.save_progress_url,
            {
                "level1": True,
                "level2": False,
                "lastLevel": 1
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "saved")

        progress = UserProgress.objects.get(user=user)
        self.assertEqual(progress.data["level1"], True)
        self.assertEqual(progress.data["level2"], False)
        self.assertEqual(progress.data["lastLevel"], 1)

    def test_get_progress_after_saving(self):
        self.authenticate_user()

        saved_progress = {
            "level1": True,
            "level2": True,
            "lastLevel": 2
        }

        self.client.post(
            self.save_progress_url,
            saved_progress,
            format="json"
        )

        response = self.client.get(self.progress_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["level1"], True)
        self.assertEqual(response.data["level2"], True)
        self.assertEqual(response.data["lastLevel"], 2)

    def test_update_existing_progress(self):
        self.authenticate_user()
        user = User.objects.get(username=self.user_data["username"])

        self.client.post(
            self.save_progress_url,
            {
                "level1": False
            },
            format="json"
        )

        response = self.client.post(
            self.save_progress_url,
            {
                "level1": True,
                "level3": True
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        progress = UserProgress.objects.get(user=user)
        self.assertEqual(progress.data["level1"], True)
        self.assertEqual(progress.data["level3"], True)


from django.test import TestCase


class SimpleTest(TestCase):
    def test_math_works(self):
        """A basic test to ensure the runner finds this file"""
        self.assertEqual(1 + 1, 2)