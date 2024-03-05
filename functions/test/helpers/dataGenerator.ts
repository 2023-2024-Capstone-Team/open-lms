import { callOnCallFunction, randomString } from "./helpers";
import { expect } from "chai";
import { adminAuth, adminDb } from "./config/adminSetup";

class DataGenerator {

    // @ts-ignore
    static #dummyLearnerAccount = {
        email: "firebase_unit_tests_dummy_learner_account@gmail.com",
        password: randomString(20)
    };
    // @ts-ignore
    static #dummyAdminAccount = {
        email: "firebase_unit_tests_dummy_admin_account@gmail.com",
        password: randomString(20)
    };

    // @ts-ignore
    static #dummyAccountsCreated = false;

    /**
     * Creates a dummy learner and admin account
     */
    public static async generateDummyAccounts(): Promise<void> {

        if (DataGenerator.#dummyAccountsCreated) {
            console.log("Dummy accounts already created, skipping...");
            return;
        }

        console.log("============================");
        console.log("Generating dummy accounts...");
        console.log("============================");



        const learnerEmail = DataGenerator.#dummyLearnerAccount.email;
        console.log(`Generating dummy learner account (${learnerEmail})...`);

        await callOnCallFunction("createAccount", DataGenerator.#dummyLearnerAccount).then(async (result) => {
            expect(result.data).to.be.a('string');
            expect(result.data).to.match(new RegExp("^[a-zA-Z0-9]{28}$"));

            console.log(`Automatically verifying email for ${learnerEmail}`);
            await adminAuth.updateUser(<string> result.data, { emailVerified: true })
                .catch((err) => { throw new Error(`Error manually verifying email for ${learnerEmail}: ${err}`); });
            console.log(`Successfully verified email for ${learnerEmail}`);
        });



        const adminEmail = DataGenerator.#dummyAdminAccount.email;
        console.log(`\nGenerating dummy admin account (${adminEmail})...`);

        const uid: string = await callOnCallFunction("createAccount", DataGenerator.#dummyAdminAccount).then((result) => {
            expect(result.data).to.be.a('string');
            expect(result.data).to.match(new RegExp("^[a-zA-Z0-9]{28}$"));

            console.log("Account created successfully, adding to test data file...");
            return <string> result.data;
        });

        console.log(`\nAutomatically verifying email and giving admin permissions to ${adminEmail}`);
        const verifyEmail = adminAuth.updateUser(uid, { emailVerified: true })
            .catch((err) => { throw new Error(`Error manually verifying email for ${adminEmail}: ${err}`); });

        const addAdminPermissions = adminDb.doc(`/User/${uid}`)
            .update({ admin: true })
            .then(() => console.log(`Successfully updated user document for ${adminEmail} to admin permissions`))
            .catch((err) => { throw new Error(`Error updating user document for ${adminEmail} to admin permissions: ${err}`); });

        await Promise.all([verifyEmail, addAdminPermissions]);

        DataGenerator.#dummyAccountsCreated = true;
    }

    /**
     * Gets the dummy learner account
     */
    public static getDummyLearnerAccount() {
        if (!DataGenerator.#dummyAccountsCreated) {
            throw new Error("Dummy accounts have not been created, please run 'generateDummyAccounts' first");
        }
        return DataGenerator.#dummyLearnerAccount;
    }

    /**
     * Gets the dummy admin account
     */
    public static getDummyAdminAccount() {
        if (!DataGenerator.#dummyAccountsCreated) {
            throw new Error("Dummy accounts have not been created, please run 'generateDummyAccounts' first");
        }
        return DataGenerator.#dummyAdminAccount;
    }

    /**
     * Cleans all test data (whole database + all accounts); must be run after every a test suite
     */
    public static async cleanTestData() {

        console.log("\nCleaning test accounts...");

        const users = await adminAuth.listUsers().then((listUsersResult) => listUsersResult.users);
        await Promise.all([...users.map((user) => adminAuth.deleteUser(user.uid))]);

        DataGenerator.#dummyAccountsCreated = false;

        console.log("Successfully cleaned test accounts (triggers will remove database data)");
    }
}

export default DataGenerator;
