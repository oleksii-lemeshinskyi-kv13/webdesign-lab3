import express from "express";
import admin from "firebase-admin";
import serviceAccount from "./firebase-key.json" assert { type: "json" };
import { Timestamp } from "@google-cloud/firestore";
import cors from "cors";

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.use(express.json());
app.use(express.static("vue-app/dist"));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

app.get("/:key([a-zA-Z0-9]{6})", async (req, res) => {
  try {
    const docRef = await db.collection("urls").doc(req.params.key).get();

    if (!docRef.exists) {
      res.status(404).send("URL not found");
      return;
    }

    const urlData = docRef.data();
    if (!urlData || !urlData.url) {
      res.status(404).send("URL data is incomplete or missing");
      return;
    }

    res.redirect(urlData.url);
  } catch (error) {
    console.error("Failed to retrieve document:", error);
    res.status(500).send("Server error while retrieving URL");
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const { url, userId } = req.body;

    if (!url) {
      res.status(400).send("Missing url");
      return;
    }

    const docData = {
      url,
      createdAt: Timestamp.now(),
    };

    if (userId) {
      docData.userId = userId;
    }

    const key = generateShortHash(url + Date.now().toString());

    const docRef = db.collection("urls").doc(key);

    await docRef.set(docData);

    res.status(201).send({
      message: "URL added successfully",
      key: key,
      url: url,
    });
  } catch (error) {
    console.error("Error adding URL to Firestore:", error);
    res.status(500).send("Error adding URL to Firestore");
  }
});

app.delete("/api/delete", async (req, res) => {
  try {
    const { key, userId } = req.body;

    if (!key) {
      res.status(400).send("Missing key");
      return;
    }

    const docRef = db.collection("urls").doc(key);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).send("Document not found");
      return;
    }

    const docData = doc.data();

    if (docData.userId != userId) {
      res.status(403).send("Unauthorized to delete this document");
      return;
    }

    await docRef.delete();

    res.status(200).send({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL from Firestore:", error);
    res.status(500).send("Error deleting URL from Firestore");
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, gender, dob, userId } = req.body;

    if (!username || !email || !gender || !dob || !userId) {
      res.status(400).send("Missing required fields");
      return;
    }

    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
      res.status(400).send("Email already registered");
      return;
    }

    const userData = {
      username,
      email,
      gender,
      dob,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db.collection("users").doc(userId).set(userData);

    res.status(201).send({
      message: "User registered successfully",
      userId: docRef.id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

app.post("/api/getUser", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).send("Missing userId");
      return;
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      res.status(404).send("User not found");
      return;
    }

    const userData = userDoc.data();

    res.status(200).send({
      message: "User data retrieved successfully",
      userData: userData,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send("Error retrieving user data");
  }
});

app.post("/api/getUserUrls", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).send("Missing userId");
      return;
    }

    const urlsSnapshot = await db
      .collection("urls")
      .where("userId", "==", userId)
      .get();

    if (urlsSnapshot.empty) {
      res.status(200).send({
        message: "No URLs found for this user",
        userUrls: [],
      });
      return;
    }

    const userUrls = [];
    urlsSnapshot.forEach((doc) => {
      userUrls.push({
        key: doc.id,
        url: doc.data().url,
      });
    });

    res.status(200).send({
      message: "User URLs retrieved successfully",
      userUrls: userUrls,
    });
  } catch (error) {
    console.error("Error retrieving user URLs:", error);
    res.status(500).send("Error retrieving user URLs");
  }
});

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'vue-app/dist' });
});

async function isEmailRegistered(email) {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  return !snapshot.empty;
}

function generateShortHash(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert the result to a string with a base of your choice (here, base 36 is used)
  return Math.abs(hash).toString(36);
}
