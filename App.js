import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        savedTasks && setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Erro ao salvar tarefas", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim().length > 0) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false },
      ]);
      setNewTask("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Atenção", "Por favor, digite uma tarefa.");
    }
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () =>
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
      },
    ]);
  };

  const renderList = ({ item }) => (
    <View style={[styles.taskItem, theme.taskItem]} key={item.id}>
      <TouchableOpacity
        onPress={() => toggleTaskCompleted(item.id)}
        style={styles.taskTextContainer}
      >
        <Text
          style={[
            styles.taskText,
            theme.taskText,
            item.completed && styles.completedTaskItem,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, theme.container]}>
      {/* Cabeçalho */}
      <View style={[styles.topBar, theme.topBar]}>
        <Text style={[styles.topBarTitle, theme.topBarTitle]}>
          📝 Minhas Tarefas
        </Text>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
          <Text style={{ fontSize: 22 }}>{darkMode ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de adicionar tarefa */}
      <View style={[styles.card, theme.card]}>
        <TextInput
          style={[styles.input, theme.input]}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={darkMode ? "#8d99ae" : "#555"}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={[styles.addButton, theme.addButton]} onPress={addTask}>
          <Text style={styles.buttonText}>➕ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas */}
      <FlatList
        style={styles.flatList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyListText, theme.emptyListText]}>
            Nenhuma tarefa adicionada ainda.
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "sans-serif",
  },
  card: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    marginBottom: 12,
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  flatListContent: { paddingBottom: 20 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderWidth: 1,
  },
  taskTextContainer: { flex: 1, marginRight: 10 },
  taskText: { fontSize: 18, flexWrap: "wrap", fontFamily: "sans-serif" },
  completedTaskItem: { textDecorationLine: "line-through", opacity: 0.5 },
  deleteButtonText: { fontSize: 22, color: "#e63946" },
  emptyListText: { textAlign: "center", marginTop: 50, fontSize: 16 },
});

// Dark Theme
const darkTheme = {
  container: { backgroundColor: "#0d1b2a" },
  topBar: { backgroundColor: "rgba(29, 53, 87, 0.8)", borderColor: "rgba(255,255,255,0.1)" },
  topBarTitle: { color: "#e0e1dd" },
  card: { backgroundColor: "rgba(29, 53, 87, 0.6)" },
  input: { backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" },
  addButton: { backgroundColor: "#2a9d8f" },
  taskItem: { backgroundColor: "rgba(29, 53, 87, 0.6)", borderColor: "rgba(255,255,255,0.1)" },
  taskText: { color: "#fff" },
  emptyListText: { color: "#8d99ae" },
};

// Light Theme
const lightTheme = {
  container: { backgroundColor: "#f9f9f9" },
  topBar: { backgroundColor: "rgba(230,230,230,0.9)", borderColor: "rgba(0,0,0,0.1)" },
  topBarTitle: { color: "#1b1b1b" },
  card: { backgroundColor: "rgba(230,230,230,0.7)" },
  input: { backgroundColor: "rgba(0,0,0,0.05)", color: "#000", borderColor: "rgba(0,0,0,0.2)" },
  addButton: { backgroundColor: "#4a90e2" },
  taskItem: { backgroundColor: "rgba(230,230,230,0.7)", borderColor: "rgba(0,0,0,0.1)" },
  taskText: { color: "#000" },
  emptyListText: { color: "#555" },
};
