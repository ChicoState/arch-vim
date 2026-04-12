# arch-vim


## Docker commands

### Might need to run
```
docker compose exec -it django-backend python manage.py makemigrations
docker compose exec -it django-backend python manage.py migrate
```

### Building after changes:
```
docker compose build --no-cache
docker compose up
```

### Manage [here](http://localhost:8000/admin/)
<br> Create a superuser to access the user accounts in localhost:8000/admin 
```
docker compose exec -it django-backend python manage.py createsuperuser
```

### SQLite file
<br> The SQLite file is in `.gitignore`, so after running the previous command, run
```
docker compose exec backend manage.py migrate
```

### Starting after being built
```
docker compose up
```

### Shutting down
```
docker compose down
```



## React frontend once running [here](http://localhost:3000/):
```
http://localhost:3000/
```

## Django backend once running [here](http://localhost:8000/):
```
http://localhost:8000/
```

