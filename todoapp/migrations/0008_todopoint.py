# Generated by Django 2.0 on 2020-05-21 13:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todoapp', '0007_todolist_textnote'),
    ]

    operations = [
        migrations.CreateModel(
            name='TodoPoint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('todopoint', models.CharField(max_length=300)),
                ('todolistid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todoapp.TodoList')),
            ],
        ),
    ]
