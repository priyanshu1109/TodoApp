# Generated by Django 2.0 on 2020-05-06 12:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todoapp', '0005_status_todotype'),
    ]

    operations = [
        migrations.AddField(
            model_name='todolist',
            name='status',
            field=models.ForeignKey(null='true', on_delete=django.db.models.deletion.SET_NULL, to='todoapp.Status'),
        ),
        migrations.AddField(
            model_name='todolist',
            name='todotype',
            field=models.ForeignKey(null='true', on_delete=django.db.models.deletion.SET_NULL, to='todoapp.ToDoType'),
        ),
    ]
