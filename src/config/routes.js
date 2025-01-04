import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ChatHeader from '../Components/ChatHeader';
import Header from '../Components/Header';
import ConsigneeRegistration from '../screens/Auth/ConsigneeRegistration';
import ConsignorRegistration from '../screens/Auth/ConsignorRegistration';
import Signin from '../screens/Auth/Signin';
import SignUp from '../screens/Auth/SignUp';
import Tran from '../screens/Auth/Tran';
import TransporterRegistration from '../screens/Auth/TransporterRegistration';
import ChatList from '../screens/Chats/ChatList';
import ChatScreen from '../screens/Chats/ChatScreen';
import ConsigneeHome from '../screens/Consignee/ConsigneeHome';
import ShipmentListConsignee from '../screens/Consignee/ShipmentListConsignee';
import ViewBidsConsignee from '../screens/Consignee/ViewBidsConsignee';
import ViewEnquiries from '../screens/Consignee/ViewEnquiries';
import BidsDetailsConsignor from '../screens/consignor/BidsDetailsConsignor';
import ConsigneeList from '../screens/consignor/ConsigneeList';
import SupervisorList from '../screens/consignor/SupervisorList';
import TransporterList from '../screens/consignor/TransporterList';
import RouteList from '../screens/consignor/RouteList';
import ConsignorHome from '../screens/consignor/ConsignorHome';
import EditProfileConsignor from '../screens/consignor/EditProfileConsignor';
import EnqDetailsConsignor from '../screens/consignor/EnqDetailsConsignor';
import EnqListConsignor from '../screens/consignor/EnqListConsignor';
import NewBooking from '../screens/consignor/NewBooking';
import NewBooking2 from '../screens/consignor/NewBooking2';
import NewBooking3 from '../screens/consignor/NewBooking3';
import NewConsignee from '../screens/consignor/NewConsignee';
import NewSupervisor from '../screens/consignor/NewSupervisor';
import ShipmentDetails from '../screens/consignor/ShipmentDetails';
import ShipmentList from '../screens/consignor/ShipmentList';
// import ShipmentDetails from '../screens/consignor/ShipmentDetails'
import ViewBids from '../screens/consignor/ViewBids';
import EditProfileTrans from '../screens/Transporter/EditProfileTrans';
import EnqDetailsTran from '../screens/Transporter/EnqDetailsTran';
import EnqListTran from '../screens/Transporter/EnqListTran';
import HomeTrans from '../screens/Transporter/HomeTrans';
import PlaceBid from '../screens/Transporter/PlaceBid';
import ShipmentDetailsTrans from '../screens/Transporter/ShipmentDetailsTrans';
import ShipmentListTrans from '../screens/Transporter/ShipmentListTrans';
import ShipmentDetailsConsignee from '../screens/Consignee/ShipmentDetailsConsignee';
import EnquiryDetailsConsignee from '../screens/Consignee/EnquiryDetailsConsignee';
import ChangeRoutes from '../screens/Transporter/ChangeRoutes';
import ConsignorAddressList from '../screens/consignor/ConsignorAddressList';
import EditProfileConsignee from '../screens/Consignee/EditProfileConsignee';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ChangePassword from '../Components/ChangePassword';

const AuthStack = createStackNavigator();
export const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Tran" headerMode={'none'}>
      <AuthStack.Screen name="Tran" component={Tran} />
      <AuthStack.Screen name="SignIn" component={Signin} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen
        name="ConsignorRegistration"
        component={ConsignorRegistration}
      />
      <AuthStack.Screen
        name="ConsigneeRegistration"
        component={ConsigneeRegistration}
      />
      <AuthStack.Screen
        name="TransporterRegistration"
        component={TransporterRegistration}
      />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};

const Consigner = createStackNavigator();
export const ConsignerNavigator = () => {
  return (
    <Consigner.Navigator initialRouteName="ConsignorHome">
      <Consigner.Screen
        name="ShipmentDetails"
        component={ShipmentDetails}
        options={{
          headerShown: true,
          header: props => <Header name="Shipment Details" />,
        }}
      />
      <Consigner.Screen
        name="EditProfileConsignor"
        component={EditProfileConsignor}
        options={{
          headerShown: true,
          header: props => <Header name="Edit Profile" />,
        }}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="New Booking" />,
        }}
        name="NewBooking"
        component={NewBooking}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="New Booking" />,
        }}
        name="NewBooking2"
        component={NewBooking2}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="New Booking" />,
        }}
        name="NewBooking3"
        component={NewBooking3}
      />
      <Consigner.Screen
        name="EnqListConsignor"
        component={EnqListConsignor}
        options={{
          headerShown: true,
          header: props => <Header name="Enquiry List" />,
        }}
      />
      <Consigner.Screen
        name="EnqDetailsConsignor"
        component={EnqDetailsConsignor}
        options={{
          headerShown: true,
          header: props => <Header name="Enquiry Details" />,
        }}
      />
      <Consigner.Screen
        name="ViewBids"
        component={ViewBids}
        options={{
          headerShown: true,
          header: props => <Header name="View Bids" />,
        }}
      />
      <Consigner.Screen
        options={{headerShown: true, header: props => <Header name="Home" />}}
        name="ConsignorHome"
        component={ConsignorHome}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Add / Edit Address" />,
        }}
        name="ConsignorAddressList"
        component={ConsignorAddressList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Chats" />,
        }}
        name="ChatsList"
        component={ChatList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <ChatHeader {...props} />,
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Consignee List" />,
        }}
        name="ConsigneeList"
        component={ConsigneeList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Supervisor List" />,
        }}
        name="SupervisorList"
        component={SupervisorList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Transporter List" />,
        }}
        name="TransporterList"
        component={TransporterList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Transporter Routes" />,
        }}
        name="RouteList"
        component={RouteList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Shipment List" />,
        }}
        name="ShipmentList"
        component={ShipmentList}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="New Consignee" />,
        }}
        name="NewConsignee"
        component={NewConsignee}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="New Supervisor" />,
        }}
        name="NewSupervisor"
        component={NewSupervisor}
      />
      <Consigner.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Bids Details" />,
        }}
        name="BidsDetailsConsignor"
        component={BidsDetailsConsignor}
      />
      <Consigner.Screen name="ChangePassword" component={ChangePassword} />
    </Consigner.Navigator>
  );
};

const Transporter = createStackNavigator();
export const TransporterNavigator = () => {
  return (
    <Transporter.Navigator initialRouteName="HomeTrans">
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Home" role="Trans" />,
        }}
        name="HomeTrans"
        component={HomeTrans}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Chats" role="Trans" />,
        }}
        name="ChatsList"
        component={ChatList}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <ChatHeader {...props} />,
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Transporter.Screen
        name="EditProfileTrans"
        component={EditProfileTrans}
        options={{
          headerShown: true,
          header: props => <Header name="Edit Profile" role="Trans" />,
        }}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Enquiries List" role="Trans" />,
        }}
        name="EnqListTran"
        component={EnqListTran}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Enquiry Details" role="Trans" />,
        }}
        name="EnqDetailsTran"
        component={EnqDetailsTran}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Change Routes" role="Trans" />,
        }}
        name="ChangeRoutes"
        component={ChangeRoutes}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Place Bid" role="Trans" />,
        }}
        name="PlaceBid"
        component={PlaceBid}
      />
      <Transporter.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Shipment List" role="Trans" />,
        }}
        name="ShipmentListTrans"
        component={ShipmentListTrans}
      />
      <Transporter.Screen
        name="ShipmentDetailsTrans"
        component={ShipmentDetailsTrans}
        options={{
          headerShown: true,
          header: props => <Header name="Shipment Details" role="Trans" />,
        }}
      />
      <Transporter.Screen name="ChangePassword" component={ChangePassword} />
    </Transporter.Navigator>
  );
};

const Consignee = createStackNavigator();
export const ConsigneeNavigator = () => {
  return (
    <Consignee.Navigator initialRouteName="ConsigneeHome">
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Home" role="consignee" />,
        }}
        name="ConsigneeHome"
        component={ConsigneeHome}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Edit Profile" role="consignee" />,
        }}
        name="EditProfileConsignee"
        component={EditProfileConsignee}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Enquiries" role="consignee" />,
        }}
        name="ViewEnquiries"
        component={ViewEnquiries}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Bids" role="consignee" />,
        }}
        name="ViewBidsConsignee"
        component={ViewBidsConsignee}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Shipments" role="consignee" />,
        }}
        name="ShipmentListConsignee"
        component={ShipmentListConsignee}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Shipments Details" role="consignee" />,
        }}
        name="ShipmentDetailsConsignee"
        component={ShipmentDetailsConsignee}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Enquiry Details" role="consignee" />,
        }}
        name="EnquiryDetailsConsignee"
        component={EnquiryDetailsConsignee}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <Header name="Chats" role="consignee" />,
        }}
        name="ChatsList"
        component={ChatList}
      />
      <Consignee.Screen
        options={{
          headerShown: true,
          header: props => <ChatHeader {...props} />,
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Consignee.Screen name="ChangePassword" component={ChangePassword} />
    </Consignee.Navigator>
  );
};
