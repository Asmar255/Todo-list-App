import { Pressable, StyleSheet, Text, TextInput, View, FlatList, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy} from "firebase/firestore"; 
  

interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  createdAt?:number;
}

export default function HomeScreen() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setinputText] = useState('');

  //Time picker states
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [customTime, setCustomTime] = useState<Date | null>(null);
  const displayTime = customTime || currentTime;
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const [showPicker, setShowPicker] = useState<boolean>(false)

  //Modal edit 
  const [editTime, setEditTime] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState('');
  const [showEditPicker, setShowEditPicker] = useState<boolean>(false);


  //useEffects for load and save 
 useEffect(() => {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    // Listens for live updates in the Firestore database
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Task, 'id'>),
      }));
      setTasks(fetchedTasks);
    }, (error) => {
      console.log("Error reading tasks from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);
  

  //time fucntions
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  //Add task function
  const addTask = async() => {
    if (!inputText.trim()) return;
    setinputText('')
    try{
      await addDoc(collection(db,"tasks"),{
      text: inputText,
      time: formatTime(displayTime),
      completed: false,
      createdAt:Date.now()
      })
      setCustomTime(null)
    }
    catch (error){
        console.log("Error adding task", error);
    }
  }

  //completed task fucntion
  const toggleTask = async(id:string,currentStatus:boolean)=>{
    try{
       const taskRef=doc(db,"tasks",id);
       await updateDoc(taskRef,{
        completed:!currentStatus
       })
    }
    catch (error){
      console.log("error toggling the task status", error)
    }
  }

  //Delete task function
  const deleteTask = async(id:string)=>{
    try{
      await deleteDoc(doc(db,"tasks",id));
    }
    catch(error){
      console.log("Error deleeting task",error)
    }
  }

  //Edditing fucntions
  const startEditing = (task: Task) => {
    setEditingTask(task)
    setEditText(task.text)
    const [timeStr, modifier] = task.time.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const parsedDate = new Date();
      parsedDate.setHours(hours, minutes, 0, 0);
      setEditTime(parsedDate);
  }

  //saving the editing task 
  const saveEdit = async()=>{
      if(editingTask && editText.trim()){
        setEditingTask(null);
          setEditText('')
        try{
          const taskRef=doc(db,"tasks",editingTask.id);
          await updateDoc(taskRef,{
              text:editText,
              time:formatTime(editTime)
          })
        }
        catch(error){
        console.log("error saving the task ",error)
        }
      }
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TaskFlow</Text>
      </View>

      {/* Input Section  */}
      <View style={styles.inputConatiner}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setinputText}
        />

        <Pressable style={({ pressed }) => [
          styles.TimePicker, { opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={() => setShowPicker(true)}
        >
          <Text>🕒 {formatTime(displayTime)}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [
          styles.plusBtn, { opacity: pressed ? 0.7 : 1 }
        ]}
          onPress={addTask}
        >
          <Text style={styles.plusBtnText}>+</Text>
        </Pressable>
      </View>

      {/* Time picker for the add task part  */}
      {showPicker &&
        <DateTimePicker
          value={displayTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, date) => {
            if (Platform.OS === 'android') {
              setShowPicker(false); // Closes on Android
            }
            if (date) {
              setCustomTime(date);
            }
          }}
        />
      }

      {/* FlatList Section  */}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, item.completed ? styles.cardCompleted : styles.cardActive]}>

            <Pressable
              onPress={() => toggleTask(item.id,item.completed)}
              style={({ pressed }) => [
                styles.checkboxContainer,
                { opacity: pressed ? 0.6 : 1.0 },
              ]}
            >
              <Ionicons
                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.completed ? '#888888' : '#FFFFFF'}
              />
            </Pressable>


            <View style={styles.taskTextContainer}>
              <Text
                style={[
                  styles.cardText,
                  item.completed && styles.cardTextCompleted,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  item.completed && styles.timeTextCompleted,
                ]}
              >
                🕒 {item.time}
              </Text>
            </View>

            <View style={styles.actionBtn}>
              <Pressable
                onPress={() => startEditing(item)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1.0 },
                ]}
              >
                <Ionicons name="create-outline" size={20} color="#BC8F8F" />
              </Pressable>

              <Pressable
                onPress={() => deleteTask(item.id)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1.0 },
                ]}
              >
                <Ionicons name="trash-outline" size={20} color="#BC8F8F" />
              </Pressable>
            </View>

          </View>
        )}
      />

      {/* Modal for edit  */}
      <Modal visible={editingTask !== null} transparent animationType="fade">
        <View style={styles.Modal}>
          <View style={styles.ModalContent}>
            <Text style={styles.heading}>Edit Task</Text>

            <Text style={styles.subHeading}>Task Name</Text>
            <TextInput
              style={styles.inputModal}
              value={editText}
              onChangeText={setEditText}
            />

            <Text style={styles.subHeading}>Time</Text>
            <Pressable
              onPress={() => setShowEditPicker(true)}
            >
              <Text style={styles.textTime}>🕒 {formatTime(editTime)}</Text>
            </Pressable>

            {showEditPicker &&
              <DateTimePicker
                value={editTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, date) => {
                  if (Platform.OS === 'android') {
                    setShowEditPicker(false); // Closes on Android
                  }
                  if (date) {
                    setEditTime(date);
                  }
                }}
              />
            }

            <View style={styles.modalBtnContainer}>
              <Pressable
                onPress={() => setEditingTask(null)}
              >
                <Text style={styles.modalBtnCancel}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveEdit}
              >
                <Text style={styles.modalBtn}>Save</Text>
              </Pressable>
            </View>

          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5F5F5'
  },
  // Header
  header: {
    alignItems: 'center',
    backgroundColor: '#2F4F4F'
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    padding: 20,
  },

  //input section
  inputConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  input: {
    flex: 2,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 12,
  },
  TimePicker: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  plusBtn: {
    backgroundColor: '#7D5252',
    padding: 10,
    borderRadius: 10,
    color: '#fff',
    alignItems: 'center',
    width: 50,
  },
  plusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    lineHeight: 24,
  },

  //Cards section
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#2F4F4F',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 20,
  },
  cardActive: {
    backgroundColor: '#1E3E3B',
  },
  cardCompleted: {
    backgroundColor: '#dae0e0',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardTextCompleted: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  timeText: {
    color: '#A2C2C0',
    fontSize: 12,
    marginTop: 4,
  },
  timeTextCompleted: {
    color: '#AAA',
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },

  //Modal 
  Modal: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 10,
  },
  ModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 25,
  },
  subHeading: {
    marginTop: 17,
    fontSize: 14,
    marginBottom: 3,
  },
  inputModal: {
    borderWidth: 1,
    borderRadius: 5,
  },
  textTime: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  modalBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  modalBtn: {
    backgroundColor: '#2F4F4F',
    padding: 10,
    borderRadius: 10,
    color: '#fff',
    fontWeight: 'bold'
  },
  modalBtnCancel: {
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold'
  },
})