/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Modal,
  Pressable,
  Button,
  AsyncStorage,
} from "react-native";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import * as ImagePicker from "expo-image-picker";
const ImagePost = () => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
  }, []);
  const pickImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={pickImg}>
        <Image
          style={{ width: 25, height: 25 }}
          source={require("../../assets/icons/imageGallery.png")}
        />
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
};

const CreatePost: React.FC = () => {
  //========  begin call api post =======
  const moment = require("moment-timezone");
  const dateCreate = moment().tz("Asia/Ho_Chi_Minh").format();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [adminId, setAdminId] = useState(1);
  const [schoolId, setSchoolId] = useState(5);
  const [createAt, setCreateAt] = useState(dateCreate);
  const [status, setStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [authorize, setAuthorize] = useState();
  const tokenForAuthor = async () => {
    const token = await AsyncStorage.getItem("idToken");
    //
    const infoUser = await AsyncStorage.getItem("infoUser");
    const objUser = JSON.parse(infoUser);
    //
    const headers = {
      Authorization: "Bearer " + token,
      // "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCIsIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiI6IiovKiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFxbHM1OFdWaURYN1lDZEUzd0FjVTlwdTlqZjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiSWQiOiIxIiwiU2Nob29sSWQiOiIiLCJHcm91cElkIjoiIiwiZXhwIjoxNjM1MjM2OTE4LCJpc3MiOiJsb2NhbGhvc3Q6MTIzNDciLCJhdWQiOiJsb2NhbGhvc3Q6MTIzNDcifQ.oOnpxsz5hYQuFhq1ikw4Gy-UN_vor3y31neyOFehJ_Y",
    };
    setAuthorize(headers);
  };

  useEffect(() => {
    tokenForAuthor();
  }, []);
  const OnChangeContentHandler = (content) => {
    setContent(content);
  };
  const OnChangeTitleHandler = (title) => {
    setContent(content);
  };
  const onSubmitFormHandler = async (headers) => {
    if (!content.trim()) {
      alert("Kh??ng ???????c b??? tr???ng");
      return;
    }
    if (!title.trim()) {
      alert("Kh??ng ???????c b??? tr???ng ");
      return;
    }
    try {
      const response = await axios.post(
        `https://truongxuaapp.online/api/v1/news`,
        {
          schoolId,
          adminId,
          title,
          content,
          createAt,
          status,
        },
        { headers }
      );
      if (response.status === 200) {
        setContent("");
        setTitle("");
        alert("T???o B??i Vi???t Th??nh C??ng");
        navigation.navigate("Trang Ch???");
        setTimeout(function () {
          setModalVisible(false);
        }, 2);
      }
    } catch (error) {
      alert("C?? l???i x???y ra ! Vui l??ng ki???m tra l???i");
    }
  };
  //=======End call api create post =========
  return (
    <View style={{ flex: 1, position: "absolute", width: "100%" }}>
      <Modal
        style={{ backgroundColor: "black", opacity: 0.5 }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            zIndex: 10,
            backgroundColor: "white",
            justifyContent: "center",
            marginLeft: 10,
            marginRight: 10,
            padding: 10,
            borderRadius: 10,
            marginTop: 50,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
              T???o B??i Vi???t
            </Text>
            <TouchableOpacity>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/icons/error.png")}
                />
              </Pressable>
            </TouchableOpacity>
          </View>
          <View>
            {/* ======Title===== */}
            <TextInput
              multiline
              placeholder="Ti??u ?????"
              editable={!isLoading}
              value={title}
              onChangeText={(title) => setTitle(title)}
              style={{
                borderRadius: 10,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                backgroundColor: "#f5f4f9",
                padding: 10,
                height: 50,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            <TextInput
              style={{
                borderRadius: 10,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                backgroundColor: "#f5f4f9",
                padding: 10,
                height: 100,
              }}
              scrollEnabled
              multiline
              placeholder="Vi???t N???i Dung"
              value={content}
              editable={!isLoading}
              onChangeText={OnChangeContentHandler}
            />
          </View>
          <View style={{ flexDirection: "row", margin: 20 }}>
            {/* =======begin  */}
            <ImagePost />
            {/* ======End ===== */}
            <Image
              style={{ width: 25, height: 25, marginLeft: 20 }}
              source={require("../../assets/icons/feedback.png")}
            />
            <Image
              style={{ width: 25, height: 25, marginLeft: 20 }}
              source={require("../../assets/icons/menu.png")}
            />
          </View>
          <TouchableOpacity
            onPress={() => onSubmitFormHandler(authorize)}
            disabled={isLoading}
          >
            <View
              style={{
                backgroundColor: "#088dcd",
                width: "100%",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                ????ng B??i
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ==================================== */}

      <View
        style={{
          zIndex: 1,
          borderRadius: 10,
          borderColor: "#d0d0d0",
          borderWidth: 1,
          backgroundColor: "#fafafa",
          padding: 10,
          margin: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
          T???o B??i Vi???t
        </Text>
        <TouchableOpacity>
          <Pressable onPress={() => setModalVisible(true)}>
            <View
              style={{
                borderRadius: 250,
                borderColor: "#d0d0d0",
                borderWidth: 1,
                backgroundColor: "#fff",
                padding: 10,
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  width: 15,
                  height: 15,
                  alignItems: "center",
                  marginTop: 3,
                  marginLeft: 5,
                }}
                source={require("../../assets/icons/pencil.png")}
              />
              <Text style={{ fontSize: 15, color: "#808080", marginLeft: 10 }}>
                T???o B??i Vi???t
              </Text>
            </View>
          </Pressable>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flexDirection: "row", marginLeft: 10 }}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/icons/imageGallery.png")}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                marginBottom: 10,
                marginLeft: 10,
              }}
            >
              ???nh/Video
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: 15 }}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/icons/feedback.png")}
            ></Image>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                marginBottom: 10,
                marginLeft: 10,
              }}
            >
              C???m X??c/Ho???t ?????ng
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default CreatePost;
