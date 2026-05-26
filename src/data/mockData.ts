export interface FirmwareFile {
  readonly id: string;
  readonly name: string;
  readonly offset: string; // Hex representation, e.g., '0x10000'
  readonly sizeText: string;
  readonly path: string; // Path under the public directory
  readonly isOptional?: boolean;
}

export const INITIAL_FIRMWARE_FILES: readonly FirmwareFile[] = [
  {
    id: "app",
    name: "Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.bin",
    offset: "0x10000",
    sizeText: "310 KB",
    path: "/bin/Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.bin",
  },
  {
    id: "partitions",
    name: "Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.partitions.bin",
    offset: "0x8000",
    sizeText: "3 KB",
    path: "/bin/Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.partitions.bin",
  },
  {
    id: "bootloader",
    name: "Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.bootloader.bin",
    offset: "0x1000",
    sizeText: "24 KB",
    path: "/bin/Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.bootloader.bin",
  },
  {
    id: "boot_app",
    name: "boot_app0.bin",
    offset: "0xe000",
    sizeText: "8 KB",
    path: "/bin/boot_app0.bin",
  },
];

export const MERGED_FIRMWARE_FILE: FirmwareFile = {
  id: "merged",
  name: "Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.merged.bin",
  offset: "0x0",
  sizeText: "4.0 MB",
  path: "/bin/Bushers_Samsung_NU_TU_ESP32_CLASICO.ino.merged.bin",
};

export const BAUD_RATES = [
  { id: "115200", label: "115200" },
  { id: "230400", label: "230400" },
  { id: "460800", label: "460800" },
  { id: "921600", label: "921600" },
];

export const PORT_INFO = {
  vendorId: "0x1A86 (CH340)",
  productId: "0x7523",
  driverName: "WCH USB-Serial driver detected",
};
