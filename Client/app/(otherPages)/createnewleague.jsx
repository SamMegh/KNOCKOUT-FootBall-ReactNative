import { Redirect, useRouter } from "expo-router";
import { Formik } from "formik";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function createnewleague() {
  const router = useRouter();
  const {isAuthUser} = useAuthStore();
  const {createmyownleague}= useLeagueStore();
  const handleSubmit=async(values)=>{
await createmyownleague(values);
  }
  if (!isAuthUser) return <Redirect href="/" />;
  return (
    <View>
      <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base text-blue-600 mb-4">← Go Back</Text>
            </TouchableOpacity>
      <Formik
      initialValues={{name: "", joinfee: "",end: "",start: "",maxTimeTeamSelect: "",lifelinePerUser: ""}}
      onSubmit={handleSubmit}
      >
        {({handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,})=>(
                <View className="space-y-6 bg-black">

                  <View>
                  <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                    League Name :
                  </Text>
                  <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                  placeholder="enter the league name"
                  />
                  {touched.name&&errors.name&&(
                    <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.name}
                    </Text>
                  )}
                  </View>

                  <View>
                    <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                      Start From : 
                    </Text>
                    <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("start")}
                    onBlur={handleBlur("start")}
                    value={values.start}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    placeholder="what is starting date"
                    />
                    {touched.start&&errors.start&&(
                      <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.start}
                    </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                      Ending at : 
                    </Text>
                    <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("end")}
                    onBlur={handleBlur("end")}
                    value={values.end}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    placeholder="what is ending date"
                    />
                    {touched.end&&errors.end&&(
                      <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.end}
                    </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                      Number of times team can repeat : 
                    </Text>
                    <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("maxTimeTeamSelect")}
                    onBlur={handleBlur("maxTimeTeamSelect")}
                    value={values.maxTimeTeamSelect}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    placeholder="Number of times team can repeat "
                    />
                    {touched.maxTimeTeamSelect&&errors.maxTimeTeamSelect&&(
                      <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.maxTimeTeamSelect}
                    </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                      life Line  : 
                    </Text>
                    <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("lifelinePerUser")}
                    onBlur={handleBlur("lifelinePerUser")}
                    value={values.lifelinePerUser}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    placeholder="number of time fails allowed"
                    />
                    {touched.lifelinePerUser&&errors.lifelinePerUser&&(
                      <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.lifelinePerUser}
                    </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[#e4bf57] font-Prismfont_CLv2 my-2">
                      Joining fee : 
                    </Text>
                    <TextInput
                   className="h-12 w-full rounded-full font-Prismfont_CLv2 px-4 text-white border border-white/30 bg-white/10"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange("joinfee")}
                    onBlur={handleBlur("joinfee")}
                    value={values.joinfee}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    placeholder="joining fee i.e 399"
                    />
                    {touched.joinfee&&errors.joinfee&&(
                      <Text className="text-red-500 font-Prismfont_CLv2 mb-2">
                      {errors.joinfee}
                    </Text>
                    )}
                  </View>
                  <TouchableOpacity
                  onPress={handleSubmit}
                  className="h-12 my-6 flex justify-center text-center align-middle items-center w-full rounded-full  px-4 text-white border border-white/30 bg-white/10"
                >
                  <Text className="font-Prismfont_CLv2 text-xl text-[#e4bf57] hover:text-black">
                    Submit
                  </Text>
                </TouchableOpacity>
                </View>
  )}
      </Formik>
    </View>
  )
}

export default createnewleague
