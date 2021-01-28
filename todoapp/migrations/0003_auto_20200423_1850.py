# Generated by Django 2.0 on 2020-04-23 13:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todoapp', '0002_userprofile_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='TodoList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=45)),
                ('created', models.DateTimeField()),
            ],
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='profpic',
            field=models.ImageField(upload_to='profpic'),
        ),
        migrations.AddField(
            model_name='todolist',
            name='userprof',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todoapp.UserProfile'),
        ),
    ]
