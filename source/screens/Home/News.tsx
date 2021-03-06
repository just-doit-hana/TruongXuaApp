/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  AsyncStorage,
} from "react-native";
import { COLORS, FONTS, icons, SIZES } from "../../constant";
import { StyleSheet } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import axios from "axios";
import { idText } from "typescript";

// ========= Start Modal=========

const ModalPoup = ({ visible, children }: { visible: any; children: any }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={style.modalBackGround}>
        <Animated.View
          style={[style.modalContainer, { transform: [{ scale: scaleValue }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
// ======== End Modal=========
const News: React.FC = () => {
  const moment = require("moment-timezone");
  const dateCreate = moment().tz("Asia/Ho_Chi_Minh").format();
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [statusList, setStatusList] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    tokenForAuthor();
  }, [isFocused, statusList, visible]);
  const [authorize, setAuthorize] = useState();
  const tokenForAuthor = async () => {
    const token = await AsyncStorage.getItem("idToken");
    //
    const infoUser = await AsyncStorage.getItem("infoUser");
    const objUser = JSON.parse(infoUser);
    const headers = {
      Authorization: "Bearer " + token,
      // "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCIsIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiI6IiovKiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFxbHM1OFdWaURYN1lDZEUzd0FjVTlwdTlqZjIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiSWQiOiIxIiwiU2Nob29sSWQiOiIiLCJHcm91cElkIjoiIiwiZXhwIjoxNjM1MjM2OTE4LCJpc3MiOiJsb2NhbGhvc3Q6MTIzNDciLCJhdWQiOiJsb2NhbGhvc3Q6MTIzNDcifQ.oOnpxsz5hYQuFhq1ikw4Gy-UN_vor3y31neyOFehJ_Y",
    };
    setAuthorize(headers);
    await featchNews(headers);
  };

  const featchNews = async (headers) => {
    try {
      const response = await axios.get(
        "https://truongxuaapp.online/api/v1/news?sort=desc&pageNumber=0&pageSize=0",
        { headers }
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (date) => {
    const day = new Date(date);
    return (
      String(day.getDate()).padStart(2, "0") +
      " tha??ng " +
      String(day.getMonth() + 1).padStart(2, "0") +
      ", " +
      day.getFullYear() +
      " lu??c " +
      String(day.getHours()).padStart(2, "0") +
      ":" +
      String(day.getMinutes()).padStart(2, "0")
    );
  };
  // ====== begin detele post =======
  const onSubmitFormHandler = async (id, headers) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://truongxuaapp.online/api/v1/news/` + id,
        { headers }
      );

      if (response.status === 200) {
        alert("Xo?? B??i Vi???t Th??nh C??ng ");
        setStatusList(!statusList);
        setVisible(!visible);
      }
    } catch (error) {
      alert("B??? L???i Kh??ng Xo?? ???????c ");
      setLoading(false);
    }
  };

  const [newId, setNewId] = useState();
  const [itemC, setItemC] = useState();
  const changeIdElement = (id, item) => {
    setVisible(!visible);
    setNewId(id);
    setItemC(item);
  };
  //====== End detele post =======
  const navigation = useNavigation();
  return (
    <View style={{ marginTop: 150 }}>
      <FlatList
        extraData={visible}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                backgroundColor: COLORS.white2,
                shadowOpacity: 0.2,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginTop: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={icons.calendar}
                    style={{ height: 16, width: 16 }}
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {formatDate(item.createAt)}
                  </Text>

                  {/* begin modal */}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ModalPoup visible={visible}>
                      <View style={{ alignItems: "center" }}>
                        <View style={style.header}>
                          <TouchableOpacity onPress={() => setVisible(false)}>
                            <Image
                              source={require("../../assets/icons/error.png")}
                              style={{ height: 30, width: 30 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* =====Update Bai Viet===== */}
                      <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() =>
                          navigation.navigate("S???a B??i Vi???t", { item: itemC })
                        }
                      >
                        <Image
                          source={require("../../assets/icons/edit.png")}
                          style={{
                            height: 20,
                            width: 20,
                            marginVertical: 10,
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                        />
                        <Text>Ch???nh S???a B??i Vi???t </Text>
                      </TouchableOpacity>

                      {/*=====delete ===== */}
                      <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => onSubmitFormHandler(newId, authorize)}
                      >
                        <Image
                          source={require("../../assets/icons/delete.png")}
                          style={{
                            height: 20,
                            width: 20,
                            marginVertical: 10,
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                        />
                        <Text>Xo?? B??i Vi???t</Text>
                      </TouchableOpacity>
                    </ModalPoup>
                    <TouchableOpacity
                      onPress={() => changeIdElement(item.id, item)}
                    >
                      <Image
                        source={require("../../assets/icons/menu.png")}
                        style={{
                          height: 14,
                          width: 14,
                          marginLeft: 170,
                          marginBottom: 34,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* end modal */}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: -20,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.nTitle}
                    style={{ height: 14, width: 14 }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.black,
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </Text>
                </View>

                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
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
  iconf: {
    height: 20,
    width: 20,
  },
  text: {
    ...FONTS.h4,
    fontWeight: "500",
    marginLeft: 10,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
export default News;
