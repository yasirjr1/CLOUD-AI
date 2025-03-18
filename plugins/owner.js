const ownerContact = async (m, gss) => {
    const cmd = m.body.trim().toLowerCase(); // Convert input to lowercase and remove extra spaces

    if (cmd === 'owner') {
        try {
            const ownernumber = '254743982206'; // Owner number
            const ownername = 'BRUCE BERA'; // Owner name

            // Sending contact with the owner number and name
            await gss.sendContact(m.from, [{ number: ownernumber, name: ownername }], m);
            await m.React("✅"); // React with a success checkmark
        } catch (error) {
            console.error('Error sending owner contact:', error);
            m.reply('Error sending owner contact.');
            await m.React("❌"); // React with a failure cross mark
        }
    }
};

export default ownerContact;
