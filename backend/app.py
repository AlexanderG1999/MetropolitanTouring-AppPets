from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS




app = Flask(__name__)
CORS(app)

# Configurar la URI de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost/PetDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# Definir los modelos para las tablas
class Dueño(db.Model):
    __tablename__ = 'dueño'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    mascotas = db.relationship('Mascota', backref='dueño', lazy=True)

class Mascota(db.Model):
    __tablename__ = 'mascota'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    especie = db.Column(db.String(50), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    dueño_id = db.Column(db.Integer, db.ForeignKey('dueño.id'), nullable=False)


# Routes
# Get all pets
@app.route('/api/pets', methods=['GET'])
def get_pets():
    mascotas = Mascota.query.all()
    return jsonify([{
        'id': mascota.id,
        'nombre': mascota.nombre,
        'especie': mascota.especie,
        'edad': mascota.edad,
        'dueño': mascota.dueño.nombre
    } for mascota in mascotas])

# Guardar una nueva mascota
@app.route('/api/pets', methods=['POST'])
def create_pet():
    data = request.get_json()
    dueño = Dueño.query.filter_by(id=data['dueño']).first()
    if dueño is None:
        return jsonify({'error': 'Dueño no encontrado'}), 400
    mascota = Mascota(
        nombre=data['nombre'],
        especie=data['especie'],
        edad=data['edad'],
        dueño_id=data['dueño']
    )
    db.session.add(mascota)
    db.session.commit()
    return jsonify({
        'id': mascota.id,
        'nombre': mascota.nombre,
        'especie': mascota.especie,
        'edad': mascota.edad,
        'dueño': dueño.nombre
    })


if __name__ == '__main__':
    app.run(debug=True)