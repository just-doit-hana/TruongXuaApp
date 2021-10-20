/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/core";
import { COLORS } from "../../constant";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height
const UpdateProfile: React.FC = () => {
  const baseUrl = "http://20.188.111.70:12348";
  const navigation = useNavigation();

  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("Huytq@gmail.com");
  const [password, setPassword] = useState<string>("123456");
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [img, setImg] = useState<string>(
    "https://image-us.24h.com.vn/upload/1-2021/images/2021-03-18/gia-nhap-duong-dua-bikini-tieu-thu-ha-noi-chiem-tron-song-bb9-5639403-1616037657-573-width800height999.jpg"
  );
  const [groupId, setGroupId] = useState(1);
  const [schoolId, setSchoolId] = useState(3);

  const UpdateProfile = () => {
    axios({
      url: "http://20.188.111.70:12348/api/v1/alumni?id=123",
      method: "PUT",
      data: {
        password,
        email,
        phone,
        name,
        address,
        bio,
        img,
        groupId,
        schoolId,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Cập Nhập Thành Công");
          navigation.navigate("MyTabs");
          //   setName("");
          //   setEmail("");
          //   setAddress("");
          //   setBio("");
          //   setPassword("");
          //   setPhone("");
        } else {
          throw new Error("An error has occurred");
        }
      })
      .catch((error) => {
        alert(error);
        setRegistering(false);
      });
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 30 }}>
      <ScrollView>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // backgroundColor: "black",
            opacity: 0.5,
            width: width,
            bottom: 0,
          }}
        />
        <Text
          style={{
            color: COLORS.black,
            fontSize: 30,
            fontWeight: "500",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          Cập Nhập Thông Tin
        </Text>

        {/* =========Email====*/}
        <View style={{ marginTop: 24 }}>
          <View style={{ position: "relative" }}>
            <AntDesign
              name="user"
              style={{
                color: "#8e8e96",
                position: "absolute",
                right: 0,
                fontSize: 18,
              }}
            />
            <TextInput
              editable={false}
              placeholder="Email"
              onChangeText={(email) => setEmail(email)}
              value={email}
              placeholderTextColor="#8e8e96"
              style={{
                borderBottomColor: "#8e8e96",
                borderBottomWidth: 1,
                fontSize: 18,
                paddingBottom: 5,
                marginBottom: 14,
              }}
            />
          </View>
          {/* =======Password======== */}
          <View style={{ position: "relative", marginTop: 15 }}>
            <AntDesign
              name="lock"
              style={{
                color: "#8e8e96",
                position: "absolute",
                right: 0,
                fontSize: 18,
              }}
            />
            <TextInput
              editable={false}
              placeholder="Mật khẩu"
              secureTextEntry
              placeholderTextColor="#8e8e96"
              style={{
                borderBottomColor: "#8e8e96",
                borderBottomWidth: 1,
                marginBottom: 14,
                fontSize: 18,
                paddingBottom: 5,
              }}
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
        </View>
        {/* =======Fullname======== */}
        <View style={{ position: "relative", marginTop: 15 }}>
          <AntDesign
            name="user"
            style={{
              color: "#8e8e96",
              position: "absolute",
              right: 0,
              fontSize: 18,
            }}
          />
          <TextInput
            placeholder="Họ và tên"
            onChangeText={(name) => setName(name)}
            value={name}
            placeholderTextColor="#8e8e96"
            style={{
              borderBottomColor: "#8e8e96",
              borderBottomWidth: 1,
              marginBottom: 10,
              fontSize: 18,
              paddingBottom: 5,
            }}
          />
        </View>
        {/* ======address====== */}
        <View style={{ position: "relative", marginTop: 15 }}>
          <Entypo
            name="location-pin"
            style={{
              color: "#8e8e96",
              position: "absolute",
              right: 0,
              fontSize: 18,
            }}
          />
          <TextInput
            placeholder="Địa chỉ"
            onChangeText={(address) => setAddress(address)}
            value={address}
            placeholderTextColor="#8e8e96"
            style={{
              borderBottomColor: "#8e8e96",
              borderBottomWidth: 1,
              marginBottom: 10,
              fontSize: 18,
              paddingBottom: 5,
            }}
          />
        </View>
        {/* =======Phone====== */}
        <View style={{ position: "relative", marginTop: 15 }}>
          <AntDesign
            name="phone"
            style={{
              color: "#8e8e96",
              position: "absolute",
              right: 0,
              fontSize: 18,
            }}
          />
          <TextInput
            placeholder="Số điện thoại"
            onChangeText={(phone) => setPhone(phone)}
            value={phone}
            placeholderTextColor="#8e8e96"
            style={{
              borderBottomColor: "#8e8e96",
              borderBottomWidth: 1,
              marginBottom: 10,
              fontSize: 18,
              paddingBottom: 5,
            }}
          />
        </View>
        {/* ========Bio====== */}
        <View style={{ position: "relative", marginTop: 15 }}>
          <TextInput
            multiline
            placeholder="Miêu Tả Bản Thân"
            onChangeText={(bio) => setBio(bio)}
            value={bio}
            placeholderTextColor="#8e8e96"
            style={{
              borderBottomColor: "#8e8e96",
              borderBottomWidth: 1,
              marginBottom: 10,
              fontSize: 18,
              paddingBottom: 5,
            }}
          />
        </View>
        <TouchableOpacity onPress={UpdateProfile}>
          <View
            style={{
              backgroundColor: "#088dcd",
              width: "100%",
              borderRadius: 25,
              marginTop: 20,
              padding: 17,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",

                fontSize: 20,
              }}
            >
              Lưu
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;
