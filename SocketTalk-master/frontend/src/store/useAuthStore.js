// to maintian the all  the initial and furtther states 
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client"

//changint the end poin tfor producntion 
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/" : "/a"; //producntio changes making http://localhost:5001 to dynaic for the production 

export const useAuthStore = create((set, get) => ({

  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  //socketstate for connecting and dissconnecting 
  socket: null,

  //hitting the check auth api in the backend 
  // Temporarily modify your checkAuth to test connection
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      //user is authenticated 
      set({ authUser: res.data });

      //on refreshing connect the socket
      get().connectSocket()

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  //data after submitting the form since signup is called in defalut submit function in signupcomponent
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      //sending req to backend api
      const res = await axiosInstance.post("/auth/signup", data);
      //auth the user 
      set({ authUser: res.data });
      toast.success("Account created successfully");

      //on signup connect the socket
      get().connectSocket()


    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false }); //for the create account button state
    }
  },
  //
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      //user is authentucated 
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      //on login connect the socket
      get().connectSocket()

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  //logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      //user is set as null after logout
      set({ authUser: null });
      toast.success("Logged out successfully");

      get().dissconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  //updating the profile image
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) return

    //when the user is connected to the socket server and store the userid 
    const socket = io(BASE_URL,{
      query:{
        userId:authUser._id,
      },
    });
    socket.connect();
    //update the socket state
    set({socket:socket})

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds});
    });

  },

  dissconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();

  }

}))