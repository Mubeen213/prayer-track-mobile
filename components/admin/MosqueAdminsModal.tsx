// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   FlatList,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { X, User, Mail, Plus, Trash2 } from "lucide-react-native";
// import { Mosque } from "../../types/mosque";
// import {
//   useMosqueAdmins,
//   useCreateMosqueAdmin,
//   useRemoveMosqueAdmin,
//   MosqueAdmin,
// } from "../../hooks/useAdminMosques";

// interface MosqueAdminsModalProps {
//   visible: boolean;
//   onClose: () => void;
//   mosque: Mosque | null;
// }

// const { height: screenHeight } = Dimensions.get("window");

// export const MosqueAdminsModal: React.FC<MosqueAdminsModalProps> = ({
//   visible,
//   onClose,
//   mosque,
// }) => {
//   const [newAdminEmail, setNewAdminEmail] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);

//   const {
//     data: admins,
//     isLoading,
//     refetch,
//   } = useMosqueAdmins(mosque?.id || "");
//   const createAdminMutation = useCreateMosqueAdmin();
//   const removeAdminMutation = useRemoveMosqueAdmin();

//   const handleAddAdmin = () => {
//     if (!newAdminEmail.trim() || !mosque) {
//       Alert.alert("Error", "Please enter a valid email");
//       return;
//     }

//     // Note: You'll need to implement user lookup by email on the backend
//     // For now, we'll assume you have the user_id
//     createAdminMutation.mutate(
//       {
//         user_id: newAdminEmail.trim(), // This should be user_id from email lookup
//         mosque_id: mosque.id,
//       },
//       {
//         onSuccess: () => {
//           setNewAdminEmail("");
//           setShowAddForm(false);
//           refetch();
//         },
//       }
//     );
//   };

//   const handleRemoveAdmin = (admin: MosqueAdmin) => {
//     if (!mosque) return;

//     Alert.alert(
//       "Remove Admin",
//       `Are you sure you want to remove ${admin.name} as an admin?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: () => {
//             removeAdminMutation.mutate({
//               mosqueId: mosque.id,
//               userId: admin.id,
//             });
//           },
//         },
//       ]
//     );
//   };

//   const renderAdminItem = ({ item }: { item: MosqueAdmin }) => (
//     <View className="bg-gray-50 rounded-lg p-3 mb-2">
//       <View className="flex-row items-center justify-between">
//         <View className="flex-1">
//           <View className="flex-row items-center mb-1">
//             <User size={16} color="#6B7280" />
//             <Text className="text-sm font-medium text-gray-900 ml-2">
//               {item.name}
//             </Text>
//           </View>
//           <View className="flex-row items-center">
//             <Mail size={16} color="#6B7280" />
//             <Text className="text-sm text-gray-600 ml-2">{item.email}</Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           onPress={() => handleRemoveAdmin(item)}
//           className="p-2 rounded-lg bg-red-100"
//           disabled={removeAdminMutation.isPending}
//         >
//           <Trash2 size={16} color="#DC2626" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (!mosque) return null;

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           justifyContent: "flex-end",
//         }}
//       >
//         <View
//           style={{
//             backgroundColor: "white",
//             borderTopLeftRadius: 24,
//             borderTopRightRadius: 24,
//             maxHeight: screenHeight * 0.8,
//             minHeight: screenHeight * 0.5,
//           }}
//         >
//           {/* Header */}
//           <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
//             <Text className="text-xl font-bold text-gray-900">
//               Manage Admins
//             </Text>
//             <TouchableOpacity
//               onPress={onClose}
//               className="p-2 rounded-full bg-gray-100"
//             >
//               <X size={20} color="#374151" />
//             </TouchableOpacity>
//           </View>

//           {/* Mosque Info */}
//           <View className="p-4 bg-green-50 border-b border-gray-200">
//             <Text className="font-semibold text-green-800">{mosque.name}</Text>
//             <Text className="text-sm text-green-600">{mosque.address}</Text>
//           </View>

//           {/* Add Admin Button */}
//           <View className="p-4 border-b border-gray-200">
//             {!showAddForm ? (
//               <TouchableOpacity
//                 onPress={() => setShowAddForm(true)}
//                 className="flex-row items-center justify-center bg-blue-500 rounded-lg py-3"
//               >
//                 <Plus size={20} color="white" />
//                 <Text className="text-white font-medium ml-2">Add Admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <View className="space-y-3">
//                 <TextInput
//                   className="bg-gray-50 rounded-lg px-3 py-3 border border-gray-200"
//                   placeholder="Enter admin email"
//                   value={newAdminEmail}
//                   onChangeText={setNewAdminEmail}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//                 <View className="flex-row gap-2">
//                   <TouchableOpacity
//                     onPress={handleAddAdmin}
//                     className="flex-1 bg-green-500 rounded-lg py-2"
//                     disabled={createAdminMutation.isPending}
//                   >
//                     {createAdminMutation.isPending ? (
//                       <ActivityIndicator size="small" color="white" />
//                     ) : (
//                       <Text className="text-white font-medium text-center">
//                         Add
//                       </Text>
//                     )}
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setShowAddForm(false);
//                       setNewAdminEmail("");
//                     }}
//                     className="flex-1 bg-gray-500 rounded-lg py-2"
//                   >
//                     <Text className="text-white font-medium text-center">
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Admins List */}
//           <View className="flex-1 p-4">
//             <Text className="text-lg font-semibold text-gray-900 mb-3">
//               Current Admins ({admins?.length || 0})
//             </Text>

//             {isLoading ? (
//               <View className="flex-1 justify-center items-center">
//                 <ActivityIndicator size="large" color="#10B981" />
//                 <Text className="text-gray-600 mt-2">Loading admins...</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={admins || []}
//                 renderItem={renderAdminItem}
//                 keyExtractor={(item) => item.id}
//                 showsVerticalScrollIndicator={false}
//                 ListEmptyComponent={
//                   <View className="flex-1 justify-center items-center py-8">
//                     <Text className="text-gray-600">No admins found</Text>
//                   </View>
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };
