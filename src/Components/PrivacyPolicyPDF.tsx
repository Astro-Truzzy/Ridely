import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

const PrivacyPolicyPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text>
          At Ridely, your privacy is a top priority. This policy outlines how we
          collect, use, and protect your personal information.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text>
          - Personal Information (name, phone number, email, etc.){"\n"}-
          Location Data (for pickup and delivery tracking){"\n"}- Device
          Information and Logs
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text>
          - To provide and improve our delivery services{"\n"}- To communicate
          updates and support{"\n"}- To ensure safety, security, and fraud
          prevention
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. Sharing Your Data</Text>
        <Text>
          We do not sell your data. Your information may be shared with trusted
          third-party services that help us deliver Ridely’s core services
          (e.g., maps, payments, and delivery logistics).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>4. Cookies & Tracking</Text>
        <Text>
          We use cookies and similar technologies to enhance user experience and
          gather analytics.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>5. Your Rights</Text>
        <Text>
          You can request, correct, or delete your data at any time by
          contacting us at support@ridely.app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>6. Updates to This Policy</Text>
        <Text>
          We may occasionally update this policy. We encourage users to review
          it regularly.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>7. Contact Us</Text>
        <Text>
          If you have any questions or concerns, reach out to our support team
          at support@ridely.app.
        </Text>
      </View>

      <Text style={{ fontSize: 10, marginTop: 20, color: "gray" }}>
        Last updated: May 28, 2025
      </Text>
    </Page>
  </Document>
);

export default PrivacyPolicyPDF;
