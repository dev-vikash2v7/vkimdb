from app import db

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(255), nullable=False)
    long_description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
