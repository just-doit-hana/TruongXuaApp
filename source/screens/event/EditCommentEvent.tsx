/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  AsyncStorage,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/core";
import axios from "axios";
import { COLORS } from "../../constant";
const EditCommentEvent: React.FC = () => {
  const navigation = useNavigation();
  const [alumniId, setAlumniId] = useState<string>("");
  console.log(alumniId);
  const route = useRoute();

  const [authorize, setAuthorize] = useState();

  const tokenForAuthor = async () => {
    const token = await AsyncStorage.getItem("idToken");
    //
    const infoUser = await AsyncStorage.getItem("infoUser");
    const objUser = JSON.parse(infoUser);
    setAlumniId(objUser.Id);
    //
    const headers = {
      Authorization: "Bearer " + token,
      // "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCIsIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiI6IiovKiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFxbHM1OFdWaURYN1lDZEUzd0FjVTlwdTlqZjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiSWQiOiIxIiwiU2Nob29sSWQiOiIiLCJHcm91cElkIjoiIiwiZXhwIjoxNjM1MjM2OTE4LCJpc3MiOiJsb2NhbGhvc3Q6MTIzNDciLCJhdWQiOiJsb2NhbGhvc3Q6MTIzNDcifQ.oOnpxsz5hYQuFhq1ikw4Gy-UN_vor3y31neyOFehJ_Y",
    };
    setAuthorize(headers);
    await fetchAlumni(headers);
  };

  // Call Api Alumni
  const [alumni, setAlumni] = useState<string>("");
  const alumniURL =
    "https://truongxuaapp.online/api/v1/alumni?pageNumber=0&pageSize=0";
  const fetchAlumni = async (headers) => {
    try {
      const response = await axios.get(alumniURL, { headers });
      if (response.status === 200) {
        setAlumni(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Get Avatar and name
  const getAvtAlumni = (alumniId) => {
    let avt = "";
    for (let i = 0; i < alumni.length; i++) {
      if (alumni[i].id == alumniId) {
        avt = alumni[i].img;
        break;
      }
    }
    return avt;
  };
  const getNameAlumni = (alumniId) => {
    let name = "";
    for (let i = 0; i < alumni.length; i++) {
      if (alumni[i].id == alumniId) {
        name = alumni[i].name;
        break;
      }
    }
    return name;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [rateStart, setRateStart] = useState("");
  const [eventId, setEventId] = useState();
  const EditComment = async (headers) => {
    try {
      const response = await axios.put(
        "https://truongxuaapp.online/api/v1/feedbacks?id=" + route.params.id,
        {
          eventId,
          rateStart,
          content,
          alumniId,
        },
        { headers }
      );
      if (response.status === 200) {
        setContent(response.data.content);
        setRateStart(response.data.rateStart);
        // await fetchCommentEvent(authorize);
        navigation.navigate("Chi Tiết Sự Kiện", {
          id: eventId,
        });
        alert("Chỉnh Sửa Thành Công");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const CancelComment = (headers) => {
    navigation.navigate("Chi Tiết Sự Kiện", {
      id: eventId,
    });
  };
  useEffect(() => {
    setEventId(route.params.eventId);
    tokenForAuthor();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 40,
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Image source={{ uri: getAvtAlumni(alumniId) }} style={style.img} />
        <View
          style={{
            padding: 10,
            backgroundColor: "#f1eeee",
            width: 350,
            borderRadius: 20,
            marginLeft: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: COLORS.black,
            }}
          >
            {getNameAlumni(alumniId)}
          </Text>

          <TextInput
            placeholder={" Viết Bình Luận ..."}
            multiline
            value={content}
            editable={!isLoading}
            style={{
              borderWidth: 0.1,
              backgroundColor: "#e7e6e6",
              height: 40,
              borderRadius: 10,
              marginHorizontal: 8,
              padding: 10,
            }}
            onChangeText={(content) => setContent(content)}
          />
          <TextInput
            placeholder={"Xếp Loại"}
            onChangeText={(rating) => setRateStart(rating)}
            value={rateStart}
            editable={!isLoading}
            keyboardType="numeric"
            style={{
              borderWidth: 0.1,
              backgroundColor: "#e7e6e6",
              height: 40,
              borderRadius: 10,
              marginHorizontal: 8,
              padding: 10,
              marginTop: 10,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginRight: 30,
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => CancelComment(authorize)}
        >
          <Text style={style.text3}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={isLoading} onPress={() => EditComment(authorize)}>
          <Text style={style.text3}>Chỉnh Sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },

  text4: {
    fontSize: 14,
    color: "gray",
  },
  btnEditCmt: {
    position: "absolute",
    bottom: -40,
    right: 100,
  },
  text2: {
    fontSize: 12,
    position: "absolute",
    bottom: -30,
    color: "gray",
  },
  text3: {
    fontSize: 14,
    color: "gray",
  },
});
export default EditCommentEvent;
