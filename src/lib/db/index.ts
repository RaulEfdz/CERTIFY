// Exportaciones principales
export * from './config';
export * from './types';
export * from './utils';
// Agrega aquí más exportaciones según sea necesario

// Ejemplo de uso:
/*
import { DatabaseService } from '@/lib/db';

// Obtener todos los usuarios
const users = await DatabaseService.findAll('users');

// Crear un nuevo usuario
const newUser = await DatabaseService.create('users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Actualizar un usuario
const updatedUser = await DatabaseService.update('users', 'user-id', {
  name: 'John Updated',
});

// Eliminar un usuario
await DatabaseService.delete('users', 'user-id');
*/
