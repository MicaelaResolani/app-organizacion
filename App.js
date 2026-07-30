import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  Platform 
} from 'react-native';

export default function App() {
  const [tareas, setTareas] = useState([
    { id: '1', texto: 'Revisar documentación del proyecto', completada: false },
    { id: '2', texto: 'Organizar tareas de la semana', completada: true },
  ]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    setTareas([
      ...tareas,
      { id: Date.now().toString(), texto: nuevaTarea, completada: false }
    ]);
    setNuevaTarea('');
  };

  const alternarCompletada = (id) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
      <View style={styles.wrapper}>
        <View style={styles.container}>
          
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Mi Organización</Text>
            <Text style={styles.subtitulo}>Gestión simple y rápida</Text>
          </View>

          {/* Formulario de entrada */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribí una nueva tarea..."
              placeholderTextColor="#999"
              value={nuevaTarea}
              onChangeText={setNuevaTarea}
            />
            <TouchableOpacity style={styles.botonAgregar} onPress={agregarTarea}>
              <Text style={styles.textoBotonAgregar}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de tareas */}
          <FlatList
            data={tareas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listaContainer}
            renderItem={({ item }) => (
              <View style={styles.tarjetaTarea}>
                <TouchableOpacity 
                  style={styles.checkArea} 
                  onPress={() => alternarCompletada(item.id)}
                >
                  <View style={[styles.checkbox, item.completada && styles.checkboxCompletado]}>
                    {item.completada && <Text style={styles.checkText}>✓</Text>}
                  </View>
                  <Text style={[styles.textoTarea, item.completada && styles.textoCompletado]}>
                    {item.texto}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminarTarea(item.id)}>
                  <Text style={styles.botonEliminar}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center', // Centra la tarjeta en pantallas grandes de PC
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'web' ? 20 : 0,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Límite clave para que en la PC no se desparrame
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 24,
    // Sombras para que se vea como una tarjeta flotante
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        borderRadius: 16,
        maxHeight: '90vh',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      }
    }),
  },
  header: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#334155',
  },
  botonAgregar: {
    width: 48,
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonAgregar: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: -2,
  },
  listaContainer: {
    paddingBottom: 20,
  },
  tarjetaTarea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  checkArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxCompletado: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textoTarea: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  textoCompletado: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  botonEliminar: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});
