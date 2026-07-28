import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  TextInput, ScrollView, Modal, Alert 
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Paleta de colores pastel disponibles
const TEMAS = {
  rosa: {
    accent: '#f7aef8',
    accentBg: 'rgba(247, 174, 248, 0.15)',
    name: '🌸 Rosa',
  },
  lavanda: {
    accent: '#c77dff',
    accentBg: 'rgba(199, 125, 255, 0.15)',
    name: '🪻 Lavanda',
  },
  menta: {
    accent: '#70e4c8',
    accentBg: 'rgba(112, 228, 200, 0.15)',
    name: '🌿 Menta',
  },
  durazno: {
    accent: '#ffb5a7',
    accentBg: 'rgba(255, 181, 167, 0.15)',
    name: '🍑 Durazno',
  }
};

export default function App() {
  const [pestaña, setPestaña] = useState('hoy');
  const [colorTema, setColorTema] = useState('rosa');
  const tema = TEMAS[colorTema];

  const [minutosFoco, setMinutosFoco] = useState(30);
  const [horaSueno, setHoraSueno] = useState('23:30');
  const [horaDespertar, setHoraDespertar] = useState('07:30');
  const [horaTrabajoInicio, setHoraTrabajoInicio] = useState('09:00');
  const [horaTrabajoFin, setHoraTrabajoFin] = useState('17:00');

  const [tareas, setTareas] = useState([
    { id: '1', nombre: 'Preparar informe final', duracion: 60, energia: 'alta', completado: false, moduloActual: 1, totalModulos: 2 },
    { id: '2', nombre: 'Responder correos', duracion: 30, energia: 'baja', completado: true, moduloActual: 1, totalModulos: 1 },
  ]);

  const [victorias, setVictorias] = useState([
    { id: '101', nombre: 'Responder correos', fecha: 'Hoy', energia: 'baja' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaTareaNombre, setNuevaTareaNombre] = useState('');
  const [nuevaTareaDuracion, setNuevaTareaDuracion] = useState('30');
  const [nuevaTareaEnergia, setNuevaTareaEnergia] = useState('media');

  const [modalBufer, setModalBufer] = useState(false);
  const [tareaEnProceso, setTareaEnProceso] = useState(null);

  const [celebrando, setCelebrando] = useState(false);

  const frasesMotivacionales = [
    "Un bloque a la vez. Vas súper bien ✨",
    "Tu ritmo es el correcto 🌸",
    "Paso a paso, el mosaico cobra forma 🎨",
    "Hacé espacio para lo que importa 🌿",
    "Menos culpa, más foco ⚡"
  ];
  const [fraseActual, setFraseActual] = useState(frasesMotivacionales[0]);

  const agregarTarea = () => {
    if (!nuevaTareaNombre.trim()) {
      Alert.alert('Falta el nombre', 'Ingresá qué tenés que hacer.');
      return;
    }

    const duracionTotal = parseInt(nuevaTareaDuracion) || 30;
    const modulosCalculados = Math.ceil(duracionTotal / minutosFoco);

    const tareaNueva = {
      id: Date.now().toString(),
      nombre: nuevaTareaNombre,
      duracion: duracionTotal,
      energia: nuevaTareaEnergia,
      completado: false,
      moduloActual: 1,
      totalModulos: modulosCalculados,
    };

    setTareas([...tareas, tareaNueva]);
    setNuevaTareaNombre('');
    setNuevaTareaDuracion('30');
    setModalVisible(false);

    const nuevaFrase = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
    setFraseActual(nuevaFrase);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const iniciarTransicion = (tarea) => {
    setTareaEnProceso(tarea);
    setModalBufer(true);
  };

  const completarTarea = () => {
    if (!tareaEnProceso) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTareas(tareas.map(t => t.id === tareaEnProceso.id ? { ...t, completado: true } : t));
    setVictorias([{ id: Date.now().toString(), nombre: tareaEnProceso.nombre, fecha: 'Hoy', energia: tareaEnProceso.energia }, ...victorias]);
    
    setModalBufer(false);
    setCelebrando(true);
  };

  const rescatarDia = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const tareasRescatadas = tareas.map(t => {
      if (!t.completado) {
        return { ...t, duracion: minutosFoco, totalModulos: 1 };
      }
      return t;
    });

    setTareas(tareasRescatadas);
    Alert.alert(
      '¡Día rescatado! 🚨',
      'Sin culpas. Ajustamos tus tareas pendientes a bloques cortos y realistas para lo que queda del día.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <View style={styles.brand}>
          <View style={[styles.brandMark, { backgroundColor: tema.accent }]} />
          <Text style={styles.brandName}>Mosaico</Text>
        </View>
        <TouchableOpacity style={styles.btnRescate} onPress={rescatarDia}>
          <Text style={styles.btnRescateText}>🚨 Rescatar Día</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pestaña === 'hoy' && (
          <View>
            <Text style={styles.sectionTitle}>Rutina Fija</Text>
            
            <View style={[styles.blockCard, { borderLeftColor: tema.accent }]}>
              <Text style={styles.blockTime}>{horaSueno} - {horaDespertar}</Text>
              <View style={styles.blockMain}>
                <Text style={styles.blockName}>🌙 Descanso / Sueño</Text>
                <Text style={styles.blockTag}>Bloque fijo</Text>
              </View>
            </View>

            <View style={[styles.blockCard, { borderLeftColor: '#22b8a3' }]}>
              <Text style={styles.blockTime}>{horaTrabajoInicio} - {horaTrabajoFin}</Text>
              <View style={styles.blockMain}>
                <Text style={styles.blockName}>💼 Jornada Principal</Text>
                <Text style={styles.blockTag}>Trabajo / Estudio</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Bloques de Hoy</Text>
            {tareas.length === 0 ? (
              <Text style={styles.emptyText}>No hay tareas pendientes. ¡Sumá una con el botón +!</Text>
            ) : (
              tareas.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  disabled={item.completado}
                  style={[
                    styles.blockCard, 
                    { borderLeftColor: item.completado ? '#a29dbb' : tema.accent },
                    item.completado && styles.blockDone
                  ]}
                  onPress={() => iniciarTransicion(item)}
                >
                  <View style={styles.blockMain}>
                    <Text style={[styles.blockName, item.completado && styles.textTachado]}>
                      {item.completado ? '✅ ' : '🎯 '} {item.nombre}
                    </Text>
                    <Text style={styles.blockTag}>
                      {item.duracion} min · Energía: {item.energia === 'alta' ? '⚡ Alta' : item.energia === 'media' ? '☕ Media' : '🛋️ Baja'}
                    </Text>
                  </View>
                  {!item.completado && (
                    <View style={styles.btnCompletar}>
                      <Text style={[styles.btnCompletarText, { color: tema.accent }]}>Iniciar</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {pestaña === 'tareas' && (
          <View>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Lista de Tareas</Text>
              <TouchableOpacity style={styles.btnAgregarInline} onPress={() => setModalVisible(true)}>
                <Text style={[styles.btnAgregarInlineText, { color: tema.accent }]}>+ Agregar aparte</Text>
              </TouchableOpacity>
            </View>

            {tareas.map((t) => (
              <View key={t.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <Text style={[styles.taskTitle, t.completado && styles.textTachado]}>{t.nombre}</Text>
                  <Text style={styles.taskDuration}>{t.duracion} min</Text>
                </View>
                <Text style={styles.taskSub}>
                  {t.completado ? 'Completada' : `Energía requerida: ${t.energia.toUpperCase()}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {pestaña === 'victorias' && (
          <View>
            <Text style={styles.sectionTitle}>🏆 Caja de Victorias</Text>
            <Text style={styles.vicSub}>Todo lo que lograste hoy sin presiones:</Text>
            
            {victorias.map((v) => (
              <View key={v.id} style={styles.vicCard}>
                <Text style={styles.vicEmoji}>🌸</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vicTitle}>{v.nombre}</Text>
                  <Text style={styles.vicMeta}>Completado · {v.fecha}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {pestaña === 'config' && (
          <View>
            <Text style={styles.sectionTitle}>Ahorro y Apariencia</Text>
            
            <View style={styles.cardConfig}>
              <Text style={styles.labelInput}>Color de acento de la app:</Text>
              <View style={styles.rowTheme}>
                {Object.keys(TEMAS).map((key) => {
                  const itemTema = TEMAS[key];
                  const esSeleccionado = colorTema === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.btnTheme,
                        { borderColor: itemTema.accent },
                        esSeleccionado && { backgroundColor: itemTema.accentBg, borderWidth: 2 }
                      ]}
                      onPress={() => setColorTema(key)}
                    >
                      <View style={[styles.themeCircle, { backgroundColor: itemTema.accent }]} />
                      <Text style={[styles.themeName, esSeleccionado && { color: '#f3f1f8', fontWeight: '700' }]}>
                        {itemTema.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Configuración de Horarios</Text>
            <View style={styles.cardConfig}>
              <Text style={styles.labelInput}>Minutos por bloque de foco:</Text>
              <TextInput
                style={styles.inputStyle}
                keyboardType="numeric"
                value={String(minutosFoco)}
                onChangeText={(v) => setMinutosFoco(parseInt(v) || 15)}
              />

              <Text style={[styles.labelInput, { marginTop: 14 }]}>Horario de trabajo/estudio:</Text>
              <View style={styles.rowFlex}>
                <TextInput style={[styles.inputStyle, { flex: 1 }]} value={horaTrabajoInicio} onChangeText={setHoraTrabajoInicio} />
                <Text style={styles.separadorText}>a</Text>
                <TextInput style={[styles.inputStyle, { flex: 1 }]} value={horaTrabajoFin} onChangeText={setHoraTrabajoFin} />
              </View>

              <Text style={[styles.labelInput, { marginTop: 14 }]}>Horario de sueño:</Text>
              <View style={styles.rowFlex}>
                <TextInput style={[styles.inputStyle, { flex: 1 }]} value={horaSueno} onChangeText={setHoraSueno} />
                <Text style={styles.separadorText}>a</Text>
                <TextInput style={[styles.inputStyle, { flex: 1 }]} value={horaDespertar} onChangeText={setHoraDespertar} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: tema.accent, shadowColor: tema.accent }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        
        <Text style={styles.fraseMotivacionalText}>{fraseActual}</Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Agregar Tarea Aparte</Text>
            
            <Text style={styles.labelInput}>¿Qué tenés que hacer?</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Ej: Revisar correo o estudiar"
              placeholderTextColor="#6f6a86"
              value={nuevaTareaNombre}
              onChangeText={setNuevaTareaNombre}
            />

            <Text style={[styles.labelInput, { marginTop: 12 }]}>Duración estimada (minutos):</Text>
            <TextInput
              style={styles.inputStyle}
              keyboardType="numeric"
              value={nuevaTareaDuracion}
              onChangeText={setNuevaTareaDuracion}
            />

            <Text style={[styles.labelInput, { marginTop: 12 }]}>Nivel de energía necesario:</Text>
            <View style={styles.rowFlex}>
              <TouchableOpacity 
                style={[styles.btnEnergia, nuevaTareaEnergia === 'baja' && { borderColor: tema.accent, backgroundColor: tema.accentBg }]} 
                onPress={() => setNuevaTareaEnergia('baja')}
              >
                <Text style={styles.btnEnergiaText}>🛋️ Baja</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnEnergia, nuevaTareaEnergia === 'media' && { borderColor: tema.accent, backgroundColor: tema.accentBg }]} 
                onPress={() => setNuevaTareaEnergia('media')}
              >
                <Text style={styles.btnEnergiaText}>☕ Media</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btnEnergia, nuevaTareaEnergia === 'alta' && { borderColor: tema.accent, backgroundColor: tema.accentBg }]} 
                onPress={() => setNuevaTareaEnergia('alta')}
              >
                <Text style={styles.btnEnergiaText}>⚡ Alta</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.rowFlex, { marginTop: 22 }]}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnGuardarModal, { backgroundColor: tema.accent }]} onPress={agregarTarea}>
                <Text style={styles.btnGuardarTextModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalBufer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>☕ Preparación de 3 minutos</Text>
            <Text style={styles.buferText}>
              No te preocupes por terminar todo ahora. Solo hacé este micro-paso para empezar:
            </Text>
            <View style={styles.microCard}>
              <Text style={styles.microText}>
                👉 Servite un vaso de agua, acomodá la silla y abrí la aplicación o apunte que vas a usar para:
              </Text>
              <Text style={[styles.microTaskName, { color: tema.accent }]}>"{tareaEnProceso?.nombre}"</Text>
            </View>

            <View style={styles.rowFlex}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalBufer(false)}>
                <Text style={styles.btnCancelarText}>Volver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.btnBuferAccion, { flex: 2, backgroundColor: tema.accent }]} onPress={completarTarea}>
                <Text style={styles.btnBuferAccionText}>¡Listo, completar!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {celebrando && (
        <View style={styles.celebrateOverlay}>
          <View style={[styles.celebrateCard, { borderColor: tema.accent }]}>
            <Text style={styles.celebrateEmoji}>🌸✨</Text>
            <Text style={styles.celebrateTitle}>¡Bloque Completado!</Text>
            <Text style={styles.celebrateText}>Sumaste una nueva victoria a tu día.</Text>
            <TouchableOpacity style={[styles.btnContinuar, { backgroundColor: tema.accent }]} onPress={() => setCelebrando(false)}>
              <Text style={styles.btnContinuarText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.navbar}>
        <View style={styles.navbarInner}>
          <TouchableOpacity 
            style={[styles.navBtn, pestaña === 'hoy' && styles.navBtnActive]} 
            onPress={() => setPestaña('hoy')}
          >
            <Text style={[styles.navIc, pestaña === 'hoy' && { color: tema.accent }]}>◧</Text>
            <Text style={[styles.navLabel, pestaña === 'hoy' && styles.navLabelActive]}>Hoy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, pestaña === 'tareas' && styles.navBtnActive]} 
            onPress={() => setPestaña('tareas')}
          >
            <Text style={[styles.navIc, pestaña === 'tareas' && { color: tema.accent }]}>✎</Text>
            <Text style={[styles.navLabel, pestaña === 'tareas' && styles.navLabelActive]}>Tareas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, pestaña === 'victorias' && styles.navBtnActive]} 
            onPress={() => setPestaña('victorias')}
          >
            <Text style={[styles.navIc, pestaña === 'victorias' && { color: tema.accent }]}>🏆</Text>
            <Text style={[styles.navLabel, pestaña === 'victorias' && styles.navLabelActive]}>Victorias</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, pestaña === 'config' && styles.navBtnActive]} 
            onPress={() => setPestaña('config')}
          >
            <Text style={[styles.navIc, pestaña === 'config' && { color: tema.accent }]}>⚙</Text>
            <Text style={[styles.navLabel, pestaña === 'config' && styles.navLabelActive]}>Config</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15131c',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f3f1f8',
  },
  btnRescate: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderColor: '#ff6b6b',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  btnRescateText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6f6a86',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 18,
    marginBottom: 10,
  },
  blockCard: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockDone: {
    opacity: 0.4,
  },
  blockTime: {
    color: '#a29dbb',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 12,
  },
  blockMain: {
    flex: 1,
  },
  blockName: {
    color: '#f3f1f8',
    fontSize: 15,
    fontWeight: '700',
  },
  blockTag: {
    color: '#6f6a86',
    fontSize: 12,
    marginTop: 2,
  },
  textTachado: {
    textDecorationLine: 'line-through',
  },
  btnCompletar: {
    backgroundColor: '#272433',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnCompletarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6f6a86',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnAgregarInline: {
    backgroundColor: '#272433',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  btnAgregarInlineText: {
    fontWeight: '700',
    fontSize: 12,
  },
  taskCard: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    color: '#f3f1f8',
    fontSize: 15,
    fontWeight: '700',
  },
  taskDuration: {
    color: '#a29dbb',
    fontSize: 12,
    fontWeight: '600',
  },
  taskSub: {
    color: '#6f6a86',
    fontSize: 12,
    marginTop: 4,
  },
  vicSub: {
    color: '#a29dbb',
    fontSize: 13,
    marginBottom: 14,
  },
  vicCard: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vicEmoji: {
    fontSize: 22,
  },
  vicTitle: {
    color: '#f3f1f8',
    fontSize: 15,
    fontWeight: '700',
  },
  vicMeta: {
    color: '#6f6a86',
    fontSize: 12,
  },
  cardConfig: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  rowTheme: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  btnTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#343043',
    backgroundColor: '#272433',
  },
  themeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    color: '#a29dbb',
    fontSize: 12,
  },
  labelInput: {
    color: '#a29dbb',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputStyle: {
    backgroundColor: '#272433',
    borderColor: '#343043',
    borderWidth: 1,
    borderRadius: 12,
    color: '#f3f1f8',
    padding: 12,
    fontSize: 14,
  },
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  separadorText: {
    color: '#6f6a86',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 82,
    alignItems: 'flex-end',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabText: {
    fontSize: 28,
    color: '#15131c',
    fontWeight: '800',
    marginTop: -2,
  },
  fraseMotivacionalText: {
    color: '#a29dbb',
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'right',
    backgroundColor: 'rgba(21, 19, 28, 0.85)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 9, 14, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#15131c',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#343043',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#343043',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#f3f1f8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  btnEnergia: {
    flex: 1,
    backgroundColor: '#272433',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343043',
  },
  btnEnergiaText: {
    color: '#f3f1f8',
    fontSize: 12,
    fontWeight: '600',
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#272433',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelarText: {
    color: '#a29dbb',
    fontWeight: '700',
  },
  btnGuardarModal: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnGuardarTextModal: {
    color: '#15131c',
    fontWeight: '700',
  },
  buferText: {
    color: '#a29dbb',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  microCard: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },
  microText: {
    color: '#f3f1f8',
    fontSize: 13,
  },
  microTaskName: {
    fontWeight: '700',
    fontSize: 15,
    marginTop: 6,
  },
  btnBuferAccion: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBuferAccionText: {
    color: '#15131c',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  celebrateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 19, 28, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  celebrateCard: {
    backgroundColor: '#1e1c28',
    borderWidth: 1,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 280,
  },
  celebrateEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  celebrateTitle: {
    color: '#f3f1f8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  celebrateText: {
    color: '#a29dbb',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
  },
  btnContinuar: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  btnContinuarText: {
    color: '#15131c',
    fontWeight: '700',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  navbarInner: {
    backgroundColor: '#1e1c28',
    borderColor: '#343043',
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 5,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 14,
  },
  navBtnActive: {
    backgroundColor: '#272433',
  },
  navIc: {
    fontSize: 15,
    color: '#6f6a86',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6f6a86',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#f3f1f8',
  },
});