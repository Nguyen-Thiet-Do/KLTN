class Account {
  final int? accountId;
  final String email;
  final String phoneNumber;
  final int? roleId;
  final String? fullName;
  final String? status;
  final String? accessToken;
  final String? refreshToken;

  const Account({
    this.accountId,
    required this.email,
    required this.phoneNumber,
    this.fullName,
    this.roleId,
    this.status,
    this.accessToken,
    this.refreshToken,
  });

  Account copyWith({
    int? accountId,

    String? email,
    String? phoneNumber,
    int? roleId,
    String? fullName,
    String? status,
    String? accessToken,
    String? refreshToken,
  }) {
    return Account(
      accountId: accountId ?? this.accountId,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      roleId: roleId ?? this.roleId,
      status: status ?? this.status,
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Account &&
        other.accountId == accountId &&
        other.email == email &&
        other.fullName == fullName &&
        other.phoneNumber == phoneNumber &&
        other.status == status &&
        other.roleId == roleId &&
        other.accessToken == accessToken &&
        other.refreshToken == refreshToken;
  }

  @override
  int get hashCode {
    return accountId.hashCode ^
        email.hashCode ^
        phoneNumber.hashCode ^
        roleId.hashCode ^
        fullName.hashCode ^
        status.hashCode ^
        accessToken.hashCode ^
        refreshToken.hashCode;
  }
}
