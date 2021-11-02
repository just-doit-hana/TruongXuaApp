/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  View,
  Image,
  AsyncStorage,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Dimensions, StyleSheet } from "react-native";
import { COLORS, FONTS, icons, SIZES } from "../../constant";
import {
  AntDesign,
  Feather,
  SimpleLineIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core";
var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const Profile: React.FC = () => {
  const isFocuse = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation();
  const [user, setUser] = useState(Array);
  const [groups, setGroup] = useState(Array);
  const [events, setEvent] = useState<boolean>(false);
  const [idUser, setIdUser] = useState<string>();
  const [idGroup, setIdGroup] = useState<string>();
  const [myInfo, setMyInfo] = useState<boolean>(false);
  const [authorize, setAuthorize] = useState();
  const [idSchool, setIdSchool] = useState();
  const [visible, setVisible] = useState(false);
  const [evil, setEvil] = useState(false);
  const eventURL =
    "https://truongxuaapp.online/api/v1/events?pageNumber=0&pageSize=0";
  const groupURL =
    "https://truongxuaapp.online/api/v1/groups?pageNumber=0&pageSize=0";
  const alumniURL =
    "https://truongxuaapp.online/api/v1/alumni?pageNumber=0&pageSize=0";
  const tokenForAuthor = async () => {
    const token = await AsyncStorage.getItem("idToken");
    //
    const infoUser = await AsyncStorage.getItem("infoUser");
    const objUser = JSON.parse(infoUser);
    setIdUser(objUser.Id);
    setIdGroup(objUser.GroupId);
    setIdSchool(objUser.SchoolId);
    //
    const headers = {
      Authorization: "Bearer " + token,
      // "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCIsIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiI6IiovKiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFxbHM1OFdWaURYN1lDZEUzd0FjVTlwdTlqZjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiSWQiOiIxIiwiU2Nob29sSWQiOiIiLCJHcm91cElkIjoiIiwiZXhwIjoxNjM1MjM2OTE4LCJpc3MiOiJsb2NhbGhvc3Q6MTIzNDciLCJhdWQiOiJsb2NhbGhvc3Q6MTIzNDcifQ.oOnpxsz5hYQuFhq1ikw4Gy-UN_vor3y31neyOFehJ_Y",
    };
    setAuthorize(headers);
    await featchMyInfo(route.params.idProfile, headers, objUser.Id);
    await featchAlumni(headers, objUser.SchoolId, objUser.Id);
    await featchAlumniInGroup(headers, objUser.Id);
  };

  const featchMyInfo = async (id, headers, myId) => {
    try {
      const reponse = await axios.get(
        "https://truongxuaapp.online/api/v1/alumni/" + route.params.idProfile,
        { headers }
      );
      if (reponse.status === 200) {
        let statusFollow = await checkFollowed(headers, reponse.data.id, myId);
        let statusFollowSwap = await checkFollowedSwap(
          headers,
          reponse.data.id,
          myId
        );
        if (statusFollow == 0 && statusFollowSwap == 0) {
          reponse.data.follow = stateFollow[3].content;
        } else {
          reponse.data.follow = stateFollow[statusFollow].content;
        }
        setMyInfo(reponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Call API checkFollowed
  const [stateFollow, setStateFollow] = useState([
    {
      content: "Chờ xác nhận",
      status: false,
    },
    {
      content: "Đã gửi lời mời",
      status: false,
    },
    {
      content: "Đã kết nối",
      status: true,
    },
    {
      content: "Kết nối",
      status: true,
    },
  ]);

  const [numUser, setNumUser] = useState(Array);
  const featchAlumniInGroup = async (headers, id) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/alumniingroup?sort=desc&pageNumber=0&pageSize=0",
        { headers }
      );
      if (response.status === 200) {
        await featchGroups(headers, id, response.data);
        setNumUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function featchGroups(headers, id, listAlumniInGroup) {
    try {
      const response = await axios.get(groupURL, { headers });
      if (response.status === 200) {
        for (let i = 0; i < groups.length; i++) {
          groups.splice(i, 1);
        }
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < listAlumniInGroup.length; j++) {
            if (
              listAlumniInGroup[j].alumniId == id &&
              listAlumniInGroup[j].classId == response.data[i].id
            ) {
              groups.push(response.data[i]);
            }
          }
        }
        setVisible(!visible);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function featchAlumni(headers, schoolId, myId) {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/alumni/schoolid?schoolId=" +
          schoolId,
        { headers }
      );
      if (response.status == 200) {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i++) {
            let statusFollow = await checkFollowed(
              headers,
              response.data[i].id,
              myId
            );
            let statusFollowSwap = await checkFollowedSwap(
              headers,
              response.data[i].id,
              myId
            );
            if (statusFollow == 0 && statusFollowSwap == 0) {
              response.data[i].follow = stateFollow[3].content;
            } else {
              response.data[i].follow = stateFollow[statusFollow].content;
            }
          }
          setUser(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkFollowed = async (headers, id, myId) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/followers/checkfollowed?alumniId=" +
          id +
          "&followerId=" +
          myId,
        { headers }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkFollowedSwap = async (headers, id, myId) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/followers/checkfollowed?alumniId=" +
          myId +
          "&followerId=" +
          id,
        { headers }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeButtonFollow = (numFollow, idFollow, headers, myId) => {
    if (numFollow == "Kết nối") {
      createConnect(headers, idFollow);
    } else if (numFollow == "Đã gửi lời mời") {
      Alert.alert("Hủy", "Bạn muốn bỏ lời mời theo dõi này", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => getFollow(idFollow, myId, headers, 1),
        },
      ]);
    } else if (numFollow == "Đã kết nối") {
      Alert.alert("Hủy", "Bạn muốn bỏ kết nối người này", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => getFollow(myId, idFollow, headers, 2),
        },
      ]);
    } else if (numFollow == "Chờ xác nhận") {
      Alert.alert("Đồng ý", "Bạn đồng ý kết nối người này", [
        {
          text: "Từ chối",
          onPress: () => getFollow(myId, idFollow, headers, 1),
        },
        {
          text: "Đồng ý",
          onPress: () => getFollow(myId, idFollow, headers, 3),
        },
      ]);
    }
  };

  const getFollow = async (myId, idFollow, headers, status) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/followers/Follower/" + myId,
        { headers }
      );
      if (response.status === 200) {
        getFollowed(myId, idFollow, headers, response.data, status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getFollowed = async (myId, idFollow, headers, follow, status) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/followers/Followed/" + idFollow,
        { headers }
      );
      if (response.status === 200) {
        if (status == 1) {
          deleteFollow(headers, follow, response.data);
        } else if (status == 2) {
          deleteFollow2Site(myId, idFollow, headers, follow, response.data);
        } else {
          confirmConnect(headers, follow, response.data, idFollow, myId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // With reponse 0
  const createConnect = async (headers, idFollow) => {
    try {
      const response = await axios.post(
        "https://truongxuaapp.online/api/v1/followers",
        {
          alumniId: idFollow,
          followerAlumni: idUser,
          status: false,
        },
        { headers }
      );
      if (response.status === 200) {
        // await featchAlumni(headers, idSchool, idUser);
        setAngel(!angel);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // With response 1
  const deleteFollow = async (headers, follow, followed) => {
    let idDeleteFollow = 0;
    for (let i = 0; i < follow.length; i++) {
      for (let j = 0; j < followed.length; j++) {
        if (followed[j].id == follow[i].id) {
          idDeleteFollow = followed[j].id;
          break;
        }
      }
    }
    try {
      const response = await axios.delete(
        "https://truongxuaapp.online/api/v1/followers/" + idDeleteFollow,
        { headers }
      );
      if (response.status === 200) {
        // await featchAlumni(headers, idSchool, idUser);
        setAngel(!angel);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // With response 2
  const deleteFollow2Site = async (
    myId,
    idFollow,
    headers,
    follow,
    followed
  ) => {
    let idDeleteFollow = 0;
    for (let i = 0; i < follow.length; i++) {
      for (let j = 0; j < followed.length; j++) {
        if (followed[j].id == follow[i].id) {
          idDeleteFollow = followed[j].id;
          break;
        }
      }
    }
    try {
      const response = await axios.delete(
        "https://truongxuaapp.online/api/v1/followers/" + idDeleteFollow,
        { headers }
      );
      if (response.status === 200) {
        getFollow(idFollow, myId, headers, 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // With response 3
  const confirmConnect = async (headers, follow, followed, idFollow, myId) => {
    let idConfirmFollow = 0;
    for (let i = 0; i < follow.length; i++) {
      for (let j = 0; j < followed.length; j++) {
        if (followed[j].id == follow[i].id) {
          idConfirmFollow = followed[j].id;
          break;
        }
      }
    }
    try {
      const response = await axios.put(
        "https://truongxuaapp.online/api/v1/followers?id=" + idConfirmFollow,
        {
          alumniId: myId,
          followerAlumni: idFollow,
          status: true,
        },
        { headers }
      );
      console.log(response.status);
      if (response.status === 200) {
        await createConnectSwap(headers, idFollow);
        // featchAlumni(headers, idSchool, idUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createConnectSwap = async (headers, idFollow) => {
    try {
      const response = await axios.post(
        "https://truongxuaapp.online/api/v1/followers",
        {
          alumniId: idFollow,
          followerAlumni: idUser,
          status: true,
        },
        { headers }
      );
      if (response.status === 200) {
        // await featchAlumni(headers, idSchool, idUser);
        setAngel(!angel);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [angel, setAngel] = useState(false);
  useEffect(() => {
    tokenForAuthor();
  }, [angel]);

  const countAlumniInGroup = (idGroup) => {
    let count = 0;
    for (let i = 0; i < numUser.length; i++) {
      if (numUser[i].classId == idGroup) {
        count++;
      }
    }
    return count;
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        refreshControl={<RefreshControl onRefresh={() => tokenForAuthor()} />}
      >
        <ImageBackground
          source={require("../../assets/images/imgSignIn/bgSignIn.jpg")}
          style={{
            flex: 2,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Image source={{ uri: myInfo.img }} style={style.mainAvt}></Image>
          <Text style={style.nameProfile}>{myInfo.name}</Text>
          {route.params.idProfile == idUser ? (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity>
                <AntDesign name="user" style={style.optionTop}></AntDesign>
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="edit-2" style={style.optionTop2}></Feather>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.blue,
                  padding: 10,
                  marginTop: 16,
                  borderRadius: 6,
                }}
                onPress={() =>
                  changeButtonFollow(
                    myInfo.follow,
                    myInfo.id,
                    authorize,
                    idUser
                  )
                }
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.white,
                    fontWeight: "600",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {myInfo.follow}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>

        {/* Recent Post */}

        <View style={{ backgroundColor: COLORS.white2, padding: 10 }}>
          {myInfo.follow == "Đã kết nối" || myInfo.id == idUser ? (
            <View>
              <View style={style.title}>
                <Text style={style.textTitle}>Mô tả</Text>
              </View>
              <Text style={style.bio}>{myInfo.bio}</Text>
              <View style={style.title}>
                <Text style={style.textTitle}>Địa chỉ</Text>
              </View>
              <Text style={style.bio}>{myInfo.address}</Text>
              <View style={style.title}>
                <Text style={style.textTitle}>Số điện thoại</Text>
              </View>
              <Text style={style.bio}>{myInfo.phone}</Text>
              {myInfo.facebook != null ? (
                <View>
                  <View style={style.title}>
                    <Text style={style.textTitle}>Facebook</Text>
                  </View>
                  <Text style={style.socialText}>{myInfo.facebook}</Text>
                </View>
              ) : null}
              {myInfo.instagram != null ? (
                <View>
                  <View style={style.title}>
                    <Text style={style.textTitle}>Instargram</Text>
                  </View>
                  <Text style={style.socialText}>{myInfo.instagram}</Text>
                </View>
              ) : null}
              {myInfo.zalo != null ? (
                <View>
                  <View style={style.title}>
                    <Text style={style.textTitle}>Zalo</Text>
                  </View>
                  <Text style={style.socialText}>{myInfo.zalo}</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View>
              <Text
                style={{ textAlign: "center", fontSize: 18, marginTop: 120 }}
              >
                Hãy kết nối với nhau để gần nhau hơn
              </Text>
              <AntDesign
                name="heart"
                style={{
                  color: "red",
                  top: 120,
                  fontSize: 18,
                  position: "absolute",
                  right: 20,
                }}
              ></AntDesign>
            </View>
          )}

          {route.params.idProfile == idUser ? (
            <View>
              <View style={style.title}>
                <Text style={style.textTitle}>Người bạn đang theo dõi</Text>
              </View>

              {/* =====begin ==== */}
              <View>
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                  }}
                  keyExtractor={(item) => item._id}
                  extraData={visible}
                  data={user}
                  renderItem={({ item, index }) => {
                    if (item.id != idUser && item.follow == "Đã kết nối") {
                      return (
                        <View style={style.follow}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("Hồ Sơ", {
                                idProfile: item.id,
                              });
                            }}
                          >
                            <Image
                              source={{ uri: item.img }}
                              style={style.avatarF}
                            />
                          </TouchableOpacity>
                          <Text style={style.nameF}>{item.name}</Text>
                          <TouchableOpacity
                            style={style.btnF}
                            onPress={() => {
                              changeButtonFollow(
                                item.follow,
                                item.id,
                                authorize,
                                idUser
                              );
                            }}
                          >
                            <Text style={style.textF}>{item.follow}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                    return null;
                  }}
                />
              </View>
            </View>
          ) : null}
          {/* Joined Group */}
          {route.params.idProfile == idUser ? (
            <View>
              <View style={style.title}>
                <Text style={style.textTitle}>Nhóm đã tham gia</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Nhóm")}>
                  <Text style={style.more}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                extraData={visible}
                keyExtractor={(item) => item._id}
                horizontal
                data={groups}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                        marginBottom: 20,
                        marginRight: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Chi Tiết Nhóm", {
                            id: item.id,
                            numberAlumni: countAlumniInGroup(item.id),
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.backgroundImg }}
                          style={{ width: 185, height: 200, borderRadius: 5 }}
                        ></Image>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 5,
                          }}
                        >
                          <Text numberOfLines={1} style={style.group}>
                            {item.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="group"
                              style={style.iconGroup}
                            ></MaterialIcons>
                            <Text style={style.numberParti}>
                              {countAlumniInGroup(item.id)} người
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}

          {/* Event */}
          {/* <View style={style.title}>
            <Text style={style.textTitle}>Sự kiện đã tham gia</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Sự Kiện")}>
              <Text style={style.more}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 20 }}
          >
            <TouchableOpacity style={{ marginRight: 20 }}>
              <Image
                source={require("../../assets/images/event2.jpg")}
                style={{ width: 185, height: 200, borderRadius: 5 }}
              ></Image>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Text style={style.group}>Sự kiện A</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="access-time"
                    style={style.iconGroup}
                  ></MaterialIcons>
                  <Text style={style.numberParti}>15/10/2021</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require("../../assets/images/event3.jpg")}
                style={{ width: 185, height: 200, borderRadius: 5 }}
              ></Image>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Text style={style.group}>Sự kiện B</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="access-time"
                    style={style.iconGroup}
                  ></MaterialIcons>
                  <Text style={style.numberParti}>26/10/2021</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> */}
          {/* Blog News */}

          {/* <View style={style.title}>
            <Text style={style.textTitle}>Blogs</Text>
            <TouchableOpacity>
              <Text style={style.more}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
              <Image
                source={require("../../assets/images/event.jpg")}
                style={{
                  flex: 1,
                  height: 150,
                  marginRight: 10,
                  borderRadius: 5,
                }}
              ></Image>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={style.titleBlog}>Văn nghệ trường </Text>
                <Text style={style.by}>
                  bởi <Text style={style.authorBlog}>Van A</Text>
                </Text>
                <Text style={style.timeBlog}>2 giờ trước</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <Image
                source={require("../../assets/images/event.jpg")}
                style={{
                  flex: 1,
                  height: 150,
                  marginRight: 10,
                  borderRadius: 5,
                }}
              ></Image>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={style.titleBlog}>Văn nghệ trường </Text>
                <Text style={style.by}>
                  bởi <Text style={style.authorBlog}>Van A</Text>
                </Text>
                <Text style={style.timeBlog}>2 giờ trước</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};
const style = StyleSheet.create({
  mainAvt: {
    height: 80,
    width: 80,
    borderRadius: SIZES.largeTitle,
    marginTop: 15,
    borderColor: "white",
    borderWidth: 2,
  },
  nameProfile: {
    backgroundColor: "#00b4f0",
    padding: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  optionTop: {
    color: "white",
    fontSize: 20,
    backgroundColor: "#ff2c55",
    borderRadius: SIZES.largeTitle,
    padding: 7,
  },
  optionTop2: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
    backgroundColor: "#00b4f0",
    borderRadius: SIZES.largeTitle,
    padding: 7,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  textTitle: {
    borderLeftWidth: 5,
    borderLeftColor: "#088dcd",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "500",
    paddingLeft: 10,
  },
  group: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4d5165",
    width: 110,
    overflow: "hidden",
  },
  iconGroup: {
    color: "#088dcd",
    fontSize: 17,
    marginRight: 5,
  },
  more: {
    color: "#088dcd",
    fontSize: 15,
  },
  btn: {
    width: 100,
    height: 30,
    backgroundColor: "#eeecec",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    shadowOpacity: 0.2,
  },
  icon: {
    height: 14,
    width: 14,
    marginLeft: 8,
  },
  numberParti: {
    color: "gray",
    fontSize: 15,
  },
  iconf: {
    height: 20,
    width: 20,
  },
  text: {
    ...FONTS.h4,
    fontWeight: "500",
    marginLeft: 10,
  },
  titleBlog: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  by: {
    fontSize: 16,
    marginBottom: 5,
    color: "gray",
  },
  authorBlog: {
    color: "#088dcd",
    fontSize: 16,
  },
  timeBlog: {
    fontSize: 16,
    color: "gray",
  },
  bio: {
    fontSize: 16,
    color: "gray",
    marginLeft: 10,
    marginTop: 10,
  },
  socialText: {
    fontSize: 16,
    color: "#088dcd",
    marginLeft: 10,
    marginTop: 10,
  },
  follow: {
    backgroundColor: "#f7f4f4",
    padding: 20,
    width: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#E1E8EC",
    marginTop: 18,
  },
  avatarF: {
    height: 100,
    width: 100,
    marginLeft: 4,
    borderRadius: 8,
  },
  nameF: {
    textAlign: "center",
    color: COLORS.black,
    fontWeight: "500",
    fontSize: 18,
    marginTop: 8,
    height: 30,
  },
  addressF: {
    textAlign: "center",
    color: COLORS.blue,
    fontWeight: "400",
    fontSize: 16,
  },
  textF: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  btnF: {
    backgroundColor: COLORS.blue,
    height: 30,
    marginTop: 16,
    borderRadius: 6,
  },
});
export default Profile;
