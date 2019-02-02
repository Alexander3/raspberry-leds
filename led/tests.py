from django.test import TestCase


# Create your tests here.
class ViewTest(TestCase):
    def test_vies(self):
        response = self.client.post('/set-color', data={'color': '#ffaabb'}, content_type="application/json")
        self.assertEqual(response.status_code, 200)
