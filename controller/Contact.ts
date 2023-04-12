import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../utils/firebase";

export async function saveContactInfoToDB(loanAmount: number, salary: number, sector: string, term: number, apr: number, bankName: string, salesRepresentative: string, userPhoneNumber: string) {
    // Add a new document in collection "contacts"
    const docRef = await addDoc(collection(firestore, "contacts"), {
        loanAmount: loanAmount,
        salary: salary,
        sector: sector,
        term: term,
        APR: apr,
        bankName: bankName,
        salesRepresentative: salesRepresentative,
        userPhoneNumber: userPhoneNumber,
    });
    console.log("Contact document saved with id: " + docRef.id);
}
