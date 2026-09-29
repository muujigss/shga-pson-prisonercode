"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  SafetyCertificateOutlined,
  LockOutlined,
  GlobalOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  MenuProps,
  Button,
  Radio,
  Input,
  InputRef,
} from "antd";
import {
  LanguageProvider,
  useTranslation,
  Language,
} from "@/context/LanguageContext";
import { useFingerprint } from "@/lib/useFingerprint";
import { useAgentRelease } from "@/lib/useAgentRelease";
import { API_URL } from "@/lib/api";
import { FINGER_AGENT_DOWNLOAD_PATH } from "@/lib/fingerprint";
import FingerprintPanel from "@/components/FingerprintPanel";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { OTPRef } from "antd/es/input/OTP";
function LoginForm() {
  const [registerNum, setRegisterNum] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const registerRef = useRef<InputRef>(null);
  const otpRef = useRef<OTPRef>(null);
  const router = useRouter();
  const { login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  // Хурууны хээний төлөв агентын event-ээс гарна (docs/CLIENT_GUIDE.md)
  const fp = useFingerprint();
  // Backend-д байршуулсан хамгийн сүүлийн уншигчийн програм (байхгүй бол public дахь файл)
  const { release } = useAgentRelease();
  const fingerImage = fp.image;
  const [selectedType, setSelectedType] = useState<string>("FINGER");
  const options: CheckboxGroupProps<string>["options"] = [
    { label: t("login.typeFinger"), value: "FINGER" },
    { label: t("login.typeCode"), value: "CODE" },
  ];
  useEffect(() => {
    registerRef.current?.focus();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType === "CODE" && code.length !== 6) {
      setError(t("login.errorLength"));
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Кодоор нэвтрэхэд хурууны хээ илгээхгүй (илгээвэл backend хурууны хээний урсгал руу орно)
      if (selectedType === "FINGER") {
        await login(registerNum, code, fingerImage, fp.imageSerial);
      } else {
        await login(registerNum, code, null);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || t("login.errorInvalid"));
    } finally {
      setLoading(false);
    }
  };
  const handleOtpChange = (val: string) => {
    setCode(val);
    setError("");
  };
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
    setError("");
  };
  const handleRegisterNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegisterNum(val);
    setError("");
  };
  const items: MenuProps["items"] = [
    { key: "mn", label: "Монгол" },
    { key: "en", label: "English" },
    { key: "ru", label: "Русский" },
    { key: "zh", label: "中文" },
  ];
  const isCodeValid = code.length === 6;
  const isFingerValid = !!fingerImage;
  const isRegisterNumValid = !!registerNum;
  // Кодоор нэвтрэхэд регистр ШААРДАХГҮЙ — код өөрөө хоригдлыг цор ганцаар заана
  // (PRI_PRISONER_CODE.CODE дээр unique). Хурууны хээнд регистр заавал, учир нь
  // ХУР-ын баталгаажуулалт регистрээр явна.
  const canSubmit =
    selectedType === "CODE"
      ? isCodeValid
      : isRegisterNumValid && isFingerValid;
  const isButtonDisabled = loading || !canSubmit;
  return (
    <div className="login-container relative">
      <div className="absolute top-4 right-4 z-10">
        <Dropdown
          menu={{
            items,
            onClick: (e) => setLanguage(e.key as Language),
            selectedKeys: [language],
          }}
          placement="bottomRight"
        >
          {/*<Button
            icon={<GlobalOutlined />}
            type="text"
            style={{ color: "white" }}
          >
            {(items.find((item) => item?.key === language) as any)?.label ||
              "Монгол"}
          </Button>*/}
        </Dropdown>
      </div>
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <SafetyCertificateOutlined />
        </div>
        <h2 className="login-title">{t("login.title")}</h2>
        <p className="login-subtitle">{t("login.subtitle")}</p>
        <div className="login-input-wrapper">
          <Radio.Group
            block
            options={options}
            defaultValue="FINGER"
            buttonStyle="solid"
            optionType="button"
            size="large"
            value={selectedType}
            onChange={(e) => {
              const next = e.target.value;
              setCode("");
              fp.clearImage();
              setError("");
              // Горим солиход хуучин утга үлдээхгүй — кодоор нэвтрэхэд регистр
              // серверт огт илгээгдэхгүй байх ёстой.
              setRegisterNum("");
              setSelectedType(next);
              setTimeout(
                () =>
                  next === "CODE"
                    ? otpRef.current?.focus()
                    : registerRef.current?.focus(),
                0,
              );
            }}
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        {/* Регистр зөвхөн хурууны хээний горимд. Кодоор нэвтрэхэд хэрэггүй. */}
        {selectedType === "FINGER" && (
          <div className="login-input-wrapper">
            <Input
              ref={registerRef}
              placeholder={t("login.registerNum")}
              prefix={<UserOutlined />}
              size="large"
              value={registerNum}
              onChange={handleRegisterNumChange}
            />
          </div>
        )}
        {selectedType === "FINGER" ? (
          <div className="login-input-wrapper">
            <FingerprintPanel fp={fp} release={release} />
          </div>
        ) : (
          <div className="login-input-wrapper">
            <Input.OTP
              ref={otpRef}
              mask="*"
              value={code}
              size="large"
              onChange={handleOtpChange}
            />
            {/* <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              className="login-input"
              placeholder={t('login.placeholder')}
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              autoComplete="off"
            />
            <LockOutlined className="login-input-icon" /> */}
          </div>
        )}
        <button
          type="submit"
          className="login-btn login-input-wrapper"
          disabled={isButtonDisabled}
        >
          {loading ? t("login.buttonLoading") : t("login.buttonSubmit")}
        </button>
        <a
          href={
            release
              ? `${API_URL}${FINGER_AGENT_DOWNLOAD_PATH}`
              : "/ZkFingerprintSetup.exe.zip"
          }
          download={release?.fileName ?? "ZkFingerprintSetup.exe.zip"}
        >
          <Button color="primary" variant="link" icon={<DownloadOutlined />}>
            {t("login.downloadText")}
          </Button>
        </a>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
