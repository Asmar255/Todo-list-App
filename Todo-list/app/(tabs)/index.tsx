import { Pressable, StyleSheet,Text,TextInput,View,FlatList,Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen() {
  return (
    <SafeAreaView>

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
        />

        <Pressable style={styles.TimePicker}>
          <Text>hello</Text>
        </Pressable>

        <Pressable style={styles.plusBtn}>
          <Text style={styles.plusBtnText}>+</Text>
        </Pressable>
      </View>

      {/* FlatList Section  */}
      <View style={styles.cardContainer}>
          <Pressable>
            <AntDesign name="check-circle" size={24} color="black" />       
          </Pressable>

          <View style={styles.Todotxtpart}>
            <Text style={styles.todoTxt}>hello</Text>
            <Text style={styles.todoTxt}>🕒 17:24</Text>
          </View>

          <View style={styles.actionBtn}>
            <Pressable>
              <Ionicons name="create-outline" size={20} color="#BC8F8F" />
            </Pressable>
            <Pressable>
              <Ionicons name="trash-outline" size={20} color="#BC8F8F" />
            </Pressable>
          </View>

      </View>

      {/* Modal for edit  */}
      <Modal  animationType="fade">
        <View style={styles.Modal}>
          <View style={styles.ModalContent}>
              <Text style={styles.heading}>Edit Task</Text>

              <Text style={styles.subHeading}>Task Name</Text>
              <TextInput
              style={styles.inputModal}
              
              />

              <Text style={styles.subHeading}>Time</Text>
              <Pressable>
                <Text style={styles.textTime}>🕒</Text>
              </Pressable>

              <View style={styles.modalBtnContainer}>
                <Text style={styles.modalBtnCancel}>Cancel</Text>
                <Text style={styles.modalBtn}>Save</Text>
              </View>

          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  // Header
  header:{
    alignItems:'center',
    backgroundColor:'#2F4F4F'
  },
  headerText:{
    color:'#fff',
    fontSize:30,
    fontWeight:'bold',
    padding:20,
  },

  //input section
  inputConatiner:{
    flexDirection:'row',
    alignItems:'center',
    gap:6,
    padding: 12,
  },
  input:{
    flex:2,
    borderColor:'##CCC',
    borderWidth:1,
    borderRadius:12,
  },
  TimePicker:{
    backgroundColor:'#bfb0b0',
    padding:13,
    borderRadius:12,
  },
  plusBtn:{
    backgroundColor:'#7D5252',
    padding:10,
    borderRadius:10,
    color:'#fff',
    alignItems:'center',
    width:50,
  },
  plusBtnText:{
      color:'#fff',
      fontWeight:'bold',
      fontSize:25,
      margin:'auto',
  },

  //Cards section
  cardContainer:{
    flexDirection:'row',
    backgroundColor:'#2F4F4F',
    marginHorizontal:10,
    marginVertical:10,
    padding:16,
    borderRadius:10,
    alignItems:'center',
    gap:20,
  },
  Todotxtpart:{
    flex:1,
  },
  todoTxt:{
    color:'#fff'
  },
  actionBtn:{
    flexDirection:'row',
    justifyContent:'flex-end',
    gap:10,
    marginLeft:120,
  },

  //Modal 
  Modal:{
    flex:1,
    backgroundColor:'#00000080',
    justifyContent:'center',
    padding:10,
  },
  ModalContent:{
    backgroundColor:'#fff',
    borderRadius:10,
    padding:20,
  },
  heading:{
    color:'#000',
    fontWeight:'bold',
    fontSize:25,
  },
  subHeading:{
    marginTop:17,
    fontSize:14,
    marginBottom:3,
  },
  inputModal:{
    borderWidth:1,
    borderRadius:5,
  },
  textTime:{
      borderWidth:1,
      padding:10,
      borderRadius:5,
  },
  modalBtnContainer:{
    flexDirection:'row',
    justifyContent:'flex-end',
    gap:10,
    marginTop:10,
  },
  modalBtn:{
    backgroundColor:'#2F4F4F',
    padding:10,
    borderRadius:10,
    color:'#fff',
    fontWeight:'bold'
  },
  modalBtnCancel:{
    padding:10,
    borderRadius:10,
    fontWeight:'bold'
  },
})