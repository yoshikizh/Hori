class Admin extends HoriRecord {
  static fields() {
    return {
      email: { type: String, required: true, unique: true },
      true_name: { type: String, required: true },
      password: { type: String },
      password_salt: { type: String },
      role_id: { type: String, required: false},
      freeze: { type: Boolean, default: false },
      partnerAdmin: { type: Boolean, default: false},
      partnerId: { type: String }
    }
  }
}
HoriRecord.register(Admin);
module.exports = Admin;