"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";

import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { createTheme } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuant, setItemQuant] = useState(1);
  const [search, setSearch] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(db, "items"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item, itemQuant) => {
    const docRef = doc(collection(db, "items"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: itemQuant ? itemQuant : 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(db, "items"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <Box display={"flex"} alignItems={"center"} flexDirection={"row"}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                width="50%"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                width="50%"
                placeholder="Type a number…"
                value={itemQuant}
                onChange={(e) => setItemQuant(e.target.value)}
              />
            </Box>

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemQuant);
                setItemName("");
                setItemQuant(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        endIcon={<AddIcon />}
        sx={{
          bgcolor: "#b5e2fa",
          borderRadius: 1,
          ":hover": { bgcolor: "#166088" },
        }}
        onClick={handleOpen}
      >
        Add Item
      </Button>

      <Box
        border={"1px solid #333"}
        borderRadius={2}
        bgcolor={"#c0d6df"}
        minWidth={"1000px"}
      >
        <Box
          width="100%"
          height="100px"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={"#b5e2fa"}
          borderRadius={2}
          borderColor={"#166088"}
          p={3}
        >
          <Typography
            variant={"h2"}
            color={"#166088"}
            textAlign={"center"}
            bgcolor={"#b5e2fa"}
          >
            Inventory Items
          </Typography>
        </Box>
        <TextField
          id="outlined-basic"
          fullWidth
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Stack width="100%" height="300px" spacing={2} overflow={"auto"}>
          {inventory
            .filter((item) => {
              return search.toLowerCase() === ""
                ? item
                : item.name.toLowerCase().includes(search.toLowerCase());
            })
            .map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={5}
                bgcolor={"#dbe9ee"}
                color={"#c0d6df"}
              >
                <Box>
                  <Typography
                    variant={"h5"}
                    color={"#166088"}
                    textAlign={"center"}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant={"p"}
                    color={"#166088"}
                    textAlign={"center"}
                  >
                    Quantity: {quantity}
                  </Typography>
                </Box>

                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
