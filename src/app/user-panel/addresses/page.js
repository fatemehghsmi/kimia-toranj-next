"use client";

import { useState } from "react";
import AddressList from "@/components/AddressList/AddressList";
import AddressForm from "@/components/AddressForm/AddressForm";
import styles from "./UserAddresses.module.css";

export default function UserAddressesPage() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleAddressAdded = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <div className={styles.addressesPage}>
      <AddressList refresh={refreshFlag} />
      <AddressForm onAddressAdded={handleAddressAdded} />
    </div>
  );
}
