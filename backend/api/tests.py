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