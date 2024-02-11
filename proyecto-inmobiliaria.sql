CREATE TABLE inmobiliaria (
id SERIAL PRIMARY KEY,
nombre VARCHAR,
metros_cuadrados INT,
direccion VARCHAR,
precio_venta DECIMAL,
moneda VARCHAR
);

INSERT INTO inmobiliaria (id, nombre, metros_cuadrados, direccion, precio_venta, moneda) 
VALUES (1, 'Casa-1', 100, 'Av. Colón 123', 50000,'U$D'),
		(2,'Casa-2', 300, 'Empalme 345', 250000,'U$D'),
		(3,'Casa-3', 150, 'Garibaldi 2345', 80000,'U$D'),
		(4,'Casa-4', 200, 'Asunción 342', 15000,'U$D'),
		(5,'Casa-5', 120, 'Rondeau 4567', 190000,'U$D'),
		(6,'Casa-6', 350, 'Av. Rafael Nunes 200', 400000,'U$D');

		
SELECT * FROM inmobiliaria;

CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    contraseña VARCHAR NOT NULL,
    permisos VARCHAR NOT NULL
);


CREATE TABLE permisos (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR,
	grado VARCHAR,
	tipo INT
);


SELECT * FROM permisos;


INSERT INTO permisos (nombre, grado, tipo)
VALUES 
    ('Administrador', 'a', 1),
    ('Ingeniero', 'b', 2),
    ('Usuarios', 'c', 3),
    ('Jefe', 'd', 4);
