INSERT INTO roles (nombre, descripcion, fecha_alta, fecha_baja)
VALUES 
('Administrador', 'Rol con acceso a todas las funciones del sistema', '2024-01-01', NULL),
('Recepcionista', 'Rol para recepcionistas con acceso a gestión de clientes y planes de pago', '2024-01-01', NULL),
('Entrenador', 'Rol para entrenadores con acceso a gestión de rutinas y clientes', '2024-01-01', NULL),
('Cliente', 'Rol para clientes del gimnasio', '2024-01-01', NULL);

INSERT INTO usuarios (usuario, contrasenia, id_rol, especialidad, fecha_alta, fecha_baja)
VALUES 
('12345678', '$2b$10$2rSQgTAAIXOcoCqUR4DRd.CIPbvi4e8eKyOMxMSzRbbEGB11pQJiS', 1, NULL, '2024-01-01', NULL),  -- Administrador
('23456789', '$2b$10$CmERQrTHyUKMYWX0ISdUm.kf6OxQafy/bpnXwPbCJ6.Qoz1GAbksu', 2, NULL, '2024-01-02', NULL),  -- Recepcionista
('34567890', '$2b$10$a.ukggczQr7O/E5l9gBTeuJC02Jo0W3xXiJZRghVJZlWR0Z8txpYS', 3, 'Musculación', '2024-01-02', NULL),  -- Entrenador
('45678901', '$2b$10$XvOhQA1TpvXQV3HoatDz1uuR5zbtjwER1aQzOp39YmiPK9obP8k0i', 4, NULL,'2024-01-03', NULL);  -- Cliente

INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais)
VALUES 
('Calle Falsa', '123', 'Córdoba', 'Córdoba', '5000', 'Argentina'),
('Avenida Siempre Viva', '742', 'Buenos Aires', 'Buenos Aires', '1000', 'Argentina');

INSERT INTO personas (id_usuario, dni, sexo, nombre, apellido, fecha_nacimiento, id_domicilio, correo, telefono)
VALUES 
(1, '12345678', 'Masculino', 'Admin', 'Admin', '2024-01-01', null, '', ''),
(2, '23456789', 'Masculino', 'Carlos', 'Lopez', '1985-04-10', null, '', ''),
(3, '34567890', 'Femenino', 'Maria', 'Gonzalez', '1990-05-15', 1, '', ''),
(4, '45678901', 'Masculino', 'Juan', 'Sanchez', '1995-06-20', 2, '', '');

INSERT INTO ejercicios (nombre, descripcion)
VALUES 
('Press de banca', 'Ejercicio de fuerza para el pecho'),
('Sentadilla', 'Ejercicio compuesto para piernas'),
('Dominadas', 'Ejercicio de tracción para la espalda y bíceps');

INSERT INTO rutinas (nombre_rutina, descripcion, fecha_creacion, id_entrenador)
VALUES 
('Rutina Fuerza', 'Rutina enfocada en fuerza para todo el cuerpo', '2024-01-03', 2),
('Rutina Hipertrofia', 'Rutina enfocada en el desarrollo muscular', '2024-01-04', 2);

INSERT INTO detalles_rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion)
VALUES 
(1, 1, 4, '10 repeticiones', 90, 'Realizar con buen control'),
(1, 2, 4, '8 repeticiones', 120, 'Mantener postura correcta'),
(2, 3, 3, 'Hasta el fallo', 60, 'Mantener el core contraído');

INSERT INTO asistencias (id_cliente, fecha_entrada, fecha_salida)
VALUES 
(3, '2024-01-05 08:00:00', '2024-01-05 10:00:00');

INSERT INTO metodos_pago (nombre, fecha_alta, fecha_baja)
VALUES 
('Efectivo', '2024-01-01', NULL),
('Tarjeta de Crédito', '2024-01-01', NULL);

INSERT INTO planes_pago (nombre, descripcion, fecha_alta, fecha_baja)
VALUES 
('Plan Mensual', 'Pago mensual para acceso completo', '2024-01-01', NULL),
('Plan Anual', 'Pago anual con descuento', '2024-01-01', NULL);

INSERT INTO clientes_rutinas (id_cliente, id_rutina, observaciones, fecha_inicio, fecha_fin)
VALUES 
(3, 1, 'Cliente con buena evolución en fuerza', '2024-01-06', NULL);

INSERT INTO clientes_planes_pago (id_cliente, id_plan_pago, fecha_inicio, fecha_fin)
VALUES 
(3, 1, '2024-01-01', '2024-02-01');