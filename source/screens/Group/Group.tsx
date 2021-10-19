import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { COLORS, FONTS, icons, SIZES } from "../../constant";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { set } from "react-native-reanimated";
// const GROUPS = [
//   {
//     img: require("../../assets/images/event.jpg"),
//     name: "12A1",
//     "number-people": "1.2k",
//   },
//   {
//     img: require("../../assets/images/event2.jpg"),
//     name: "12A2",
//     "number-people": "1.2k",
//   },
//   {
//     img: require("../../assets/images/event.jpg"),
//     name: "12A1",
//     "number-people": "1.2k",
//   },
//   {
//     img: require("../../assets/images/event2.jpg"),
//     name: "12A2",
//     "number-people": "1.2k",
//   },
// ];
const JOINED_GROUP = [
  {
    img: require("../../assets/images/event.jpg"),
    name: "Quang huy",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "Quang huy",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "Quang huy",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "Quang huy",
  },
];
const SUGGESTED = [
  {
    img: require("../../assets/images/event.jpg"),
    name: "11A1",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "11A1",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "11A1",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "11A1",
  },
  {
    img: require("../../assets/images/event.jpg"),
    name: "11A1",
  },
];
const Group = () => {
  const tokenForAuthor = async () => {
    const token = await AsyncStorage.getItem("idToken");
    const headers = {
      Authorization:
        "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCIsIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiI6IiovKiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFxbHM1OFdWaURYN1lDZEUzd0FjVTlwdTlqZjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiSWQiOiIxIiwiU2Nob29sSWQiOiIiLCJHcm91cElkIjoiIiwiZXhwIjoxNjM1MjM2OTE4LCJpc3MiOiJsb2NhbGhvc3Q6MTIzNDciLCJhdWQiOiJsb2NhbGhvc3Q6MTIzNDcifQ.oOnpxsz5hYQuFhq1ikw4Gy-UN_vor3y31neyOFehJ_Y",
    };
    featchGroups(headers);
  };
  const [idToken, setIdToken] = useState<string>();
  const [groups, setGroup] = useState<boolean>(false);
  const groupURL =
    "http://20.188.111.70:12347/api/v1/groups?pageNumber=0&pageSize=0";

  async function featchGroups(headers) {
    try {
      const response = await axios.get(
        "http://20.188.111.70:12347/api/v1/groups?pageNumber=1&pageSize=5",
        { headers }
      );
      setGroup(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    tokenForAuthor();
  });
  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#088dcd",
            height: 70,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.white2,
              fontWeight: "700",
              marginLeft: 10,
            }}
          >
            Nhóm
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              fontWeight: "400",
              marginRight: 10,
            }}
          >
            Trang Chủ/Nhóm
          </Text>
        </View>
        {/* ========HEADER========= */}
        <View style={{ marginHorizontal: 16, marginVertical: 18 }}>
          <View style={style.line} />
          <Text style={style.header}>Nhóm Của Tôi</Text>
        </View>
        {/*=====FlatList Group=========  */}
        <View>
          <FlatList
            data={groups}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    padding: 10,
                    marginBottom: 20,
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("GroupDetails", { id: item.id })
                    }
                  >
                    <Image
                      source={{ uri: item.backgroundImg }}
                      style={{
                        height: 120,
                        width: 190,
                        borderRadius: SIZES.radius,
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 8,
                      alignItems: "center",
                      // justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        ...FONTS.h3,
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: "500",
                        marginLeft: 8,
                        width: 145,
                        overflow: "hidden",
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Image
                      source={icons.user2}
                      style={{
                        height: 14,
                        width: 14,
                        marginLeft: 5,
                      }}
                    />
                    <Text style={{ ...FONTS.h4, fontSize: 16, marginLeft: 2 }}>
                      {item.alumniInGroups}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
          {/* ========HEADER========= */}
          <View style={{ marginHorizontal: 16, marginVertical: 20 }}>
            <View style={style.line} />
            <Text style={style.header}>Đã Tham Gia Nhóm</Text>
            <FlatList
              data={JOINED_GROUP}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={item.img}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ ...FONTS.h4, fontSize: 18 }}>
                          {item.name}
                        </Text>
                        <Image
                          source={require("../../assets/icons/check.png")}
                          style={{ width: 14, height: 14, marginTop: 6 }}
                        />
                        <Text
                          style={{
                            ...FONTS.h3,
                            color: "#F62B53",
                            position: "relative",
                            left: 14,
                            bottom: 18,
                          }}
                        >
                          Tham Gia
                        </Text>
                      </View>
                    </View>
                    <View style={style.linegroup} />
                  </View>
                );
              }}
            />
          </View>
          {/* =========SUggested Group======== */}
          <View style={{ marginHorizontal: 16 }}>
            <View style={style.line} />
            <Text style={style.header}>Suggested Groups </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              data={SUGGESTED}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={{ marginLeft: 20 }}
                      onPress={() => navigation.navigate("GroupDetails")}
                    >
                      <Image
                        source={item.img}
                        style={{ height: 60, width: 60, borderRadius: 30 }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        marginLeft: 4,
                        marginTop: 6,
                        fontSize: 18,
                      }}
                    >
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      style={{
                        marginLeft: 20,
                        height: 30,
                        width: 90,
                        backgroundColor: "#088dcd",
                        borderRadius: 12,
                        marginTop: 4,
                      }}
                      onPress={() => navigation.navigate("GroupDetails")}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontWeight: "500",
                          fontSize: 18,
                          textAlign: "center",
                          paddingTop: 3,
                        }}
                      >
                        Tham gia
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const style = StyleSheet.create({
  header: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: "500",
    fontSize: 20,
    position: "relative",
    bottom: 24,
    left: 8,
  },
  line: {
    height: 22,
    width: 4,
    backgroundColor: "#088dcd",
  },
  linegroup: {
    height: 1,
    width: 350,
    backgroundColor: COLORS.gray,
    marginVertical: 12,
    opacity: 0.2,
  },
});
export default Group;
