import { Pressable, StyleSheet,Text,TextInput,View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>TaskFlow</Text>
      </View>

      {/* Input Section  */}
      <View>
        <TextInput
        placeholder="Add new task..."
        placeholderTextColor="#888"
        />
      </View>

      {/* cards section */}
      <View>
        
        {/* SubCards */}

        <View>
            
        </View>

      </View>

    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  // Header
  header:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#2F4F4F'
  },
  headerText:{
    color:'#fff',
    fontSize:40,
    fontWeight:'bold',
    padding:20,
  },

  //Cards
 
})