# Django Project Setup & Getting Started

## Project Structure

```
arch-vim/
├── config/              # Django project configuration
│   ├── settings.py     # Main Django settings
│   ├── urls.py         # URL routing configuration
│   ├── wsgi.py         # WSGI application
│   ├── asgi.py         # ASGI application
│   └── __init__.py
├── apps/               # Django applications directory
├── templates/          # HTML templates
├── static/             # Static files (CSS, JS, images)
├── media/              # User-uploaded media files
├── manage.py           # Django management utility
├── requirements.txt    # Python dependencies
└── .env.example        # Example environment variables
```

## Quick Start

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser (for admin access)
```bash
python manage.py createsuperuser
```

### 6. Start Development Server
```bash
python manage.py runserver
```

The site will be available at `http://localhost:8000`
Admin interface: `http://localhost:8000/admin`

## Creating a New Django App

```bash
python manage.py startapp your_app_name apps/your_app_name
```

Then add to `config/settings.py` under `INSTALLED_APPS`:
```python
'apps.your_app_name',
```

## Database Configuration

By default, the project uses SQLite. To use PostgreSQL:

1. Install: `pip install psycopg2-binary`
2. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/arch_vim_db
   ```
3. Update `config/settings.py` to use the DATABASE_URL

## Production Deployment

- Change `DEBUG=False` in `.env`
- Update `ALLOWED_HOSTS` with your domain
- Use a production-grade database (PostgreSQL)
- Use `gunicorn` as WSGI server
- Set up proper static files with `python manage.py collectstatic`
