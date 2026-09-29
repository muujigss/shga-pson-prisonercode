# ZkFingerprint Web Client — хөгжүүлэлтийн гарын авлага

Энэ баримт нь ZkFingerprint Windows програмтай WebSocket-ээр холбогдож, хурууны хээ уншуулах вэб клиент бичих хүнд (эсвэл Claude-д) зориулагдсан. Клиентийг бичихэд шаардлагатай бүх зүйл энд байна.

## 1. Ерөнхий зураглал

```
[ZK9500 уншигч] --USB--> [ZkFingerprint.exe (Windows)] --WebSocket ws://<host>:8089--> [Вэб клиент]
```

- Програм нь компьютер дээр байнга ажилладаг агент. Төхөөрөмж залгах/салгахыг өөрөө таньж, клиентэд мэдээлнэ.
- Клиент нь зөвхөн хүлээн авагч, командлагч. Төхөөрөмжийг өөрөө нээх, хаах шаардлагагүй.
- Хаяг: `ws://127.0.0.1:8089` (клиент ба агент нэг компьютер дээр бол). Өөр машинаас бол `ws://<агентийн IP>:8089`.
- Порт: `8089`. Нэг агентэд олон клиент зэрэг холбогдож болно. Бүх клиент ижил event хүлээн авна.

## 2. Мессежийн хэлбэр

### 2.1 Сервер -> клиент (JSON, text frame)

Бүх мессеж яг ийм 4 талбартай:

```json
{
  "eventType": "USB_STATUS",
  "payload": "CONNECTED",
  "version": "1.1.0.0",
  "serial": "1985263400731"
}
```

| Талбар | Утга |
|---|---|
| `eventType` | Event-ийн нэр (доорх 3-р хэсэг) |
| `payload` | Event бүрийн өгөгдөл. Заримд string, заримд object. Өгөгдөлгүй үед `""` |
| `version` | Агент програмын хувилбар (`"1.1.0.0"`) |
| `serial` | Одоо холбогдсон төхөөрөмжийн serial. **Төхөөрөмж байхгүй үед `""`** (DISCONNECTED event-д ч хоосон) |

`version` ба `serial` нь мессеж бүрт байдаг. Тиймээс event-ийн дараалалд найдаж serial-ыг тусад нь хадгалах шаардлагагүй. Мессеж бүрээс шууд уншиж болно.

### 2.2 Клиент -> сервер (энгийн текст)

JSON биш, зүгээр текст командыг text frame-ээр илгээнэ. Том жижиг үсэг ялгахгүй.

| Команд | Үйлдэл |
|---|---|
| `CMD_STATUS` | Одоогийн төлөвийн snapshot буцаана (USB_STATUS, DEVICE_INFO, enroll явж байвал ENROLL_*) |
| `CMD_OPEN_DEVICE` (эсвэл `CMD_OPEN`) | Төхөөрөмжтэй дахин холбогдохыг оролдоно, дараа нь snapshot буцаана |
| `CMD_ENROLL_START` | Бүртгэл (enroll) эхлүүлнэ. Төхөөрөмжгүй бол `ERROR`/`NO_DEVICE` |
| `CMD_ENROLL_CANCEL` | Явж буй бүртгэлийг цуцална |

Танихгүй команд ирвэл: `ERROR` event, `payload: {"code":"UNKNOWN_COMMAND","command":"..."}`.

## 3. Event-ийн жагсаалт

### Холболт ба төхөөрөмж

| eventType | payload | Тайлбар |
|---|---|---|
| `CONNECTED` | `"SUCCESS"` | Зөвхөн socket нээгдэхэд нэг удаа. Агенттай холбогдсон гэсэн үг |
| `USB_STATUS` | `"CONNECTED"` / `"DISCONNECTED"` | Төхөөрөмж залгагдсан / салсан |
| `DEVICE_INFO` | `{serial, model, vendor, width, height}` | Төхөөрөмж бэлэн болсон үед. Жишээ: `{"serial":"1985263400731","model":"ZK9500","vendor":"ZKTeco Inc.","width":300,"height":375}` |

### Хурууны хээ унших

| eventType | payload | Тайлбар |
|---|---|---|
| `FINGER_PLACED` | `""` | Хуруу тавигдлаа |
| `FINGER_IMAGE` | base64 PNG string | Уншсан зураг. **Хуруу тавьсан бүрт яг нэг удаа** ирнэ. `data:image/png;base64,` угтвар нэмж `<img src>`-д шууд тавина |
| `FINGER_REMOVED` | `""` | Хуруу авагдлаа. Илрүүлэлт 1-2 секундэд хүртэл саатаж болно |

### Бүртгэл (enroll)

Хурууг 3 удаа тавиулж, template үүсгэнэ.

| eventType | payload | Тайлбар |
|---|---|---|
| `ENROLL_STARTED` | `{"total":3}` | Бүртгэл эхэллээ |
| `ENROLL_PROGRESS` | `{"count":1,"total":3}` | `count`-дугаар удаа амжилттай авлаа |
| `ENROLL_RETRY` | `{"reason":"DIFFERENT_FINGER","count":1,"total":3}` | Тухайн удаа тооцогдсонгүй, дахин тавих. `reason`: `DIFFERENT_FINGER` (өмнөхөөс өөр хуруу) эсвэл `POOR_QUALITY` (зураг муу) |
| `ENROLL_SUCCESS` | base64 string | Template бэлэн. Энэ нь backend-д хадгалах хурууны хээний өгөгдөл |
| `ENROLL_FAILED` | `{"reason":"..."}` | `MERGE_FAILED`, `DEVICE_LOST` (бүртгэл дундуур төхөөрөмж салсан), `NO_DEVICE` |
| `ENROLL_CANCELLED` | `""` | `CMD_ENROLL_CANCEL`-ийн хариу |

Бүртгэлийн үед `FINGER_PLACED`, `FINGER_IMAGE`, `FINGER_REMOVED` мөн ирнэ (хэрэглэгчид зураг харуулахад ашиглана).

### Алдаа

| eventType | payload |
|---|---|
| `ERROR` | `{"code":"NO_DEVICE","command":"CMD_ENROLL_START"}` эсвэл `{"code":"UNKNOWN_COMMAND","command":"..."}` |

## 4. Холбогдох үеийн snapshot

Socket нээгдмэгц агент тухайн клиентэд одоогийн төлвийг өгнө. Ингэснээр хуудсыг хэзээ ч нээсэн зөв дэлгэц харуулна.

Төхөөрөмж холбогдсон үед:
```
CONNECTED -> USB_STATUS(CONNECTED) -> DEVICE_INFO
   (бүртгэл явж байвал) -> ENROLL_STARTED -> ENROLL_PROGRESS(count>0 бол)
```
Төхөөрөмжгүй үед:
```
CONNECTED -> USB_STATUS(DISCONNECTED)
```

`CMD_STATUS` ба `CMD_OPEN_DEVICE`-ийн хариу нь мөн ижил snapshot (`CONNECTED`-гүйгээр).

**Дарааллаас хамаарахгүй бич.** Мессеж бүрт `serial`, `version` байдаг тул event тус бүрийг тусад нь боловсруул.

## 5. UX төлөвүүд (prototype-ийн дагуу)

Клиент нэг л "төлөв"-ийг харуулна. Доорх хүснэгт нь event-ээс төлөв рүү шилжилтийг тодорхойлно.

| # | Төлөв | Хэзээ | Дэлгэц дээр |
|---|---|---|---|
| 1 | **Агент унтарсан** | WebSocket холбогдохгүй / салсан | "Хурууны хээний програм ажиллахгүй байна. Програмыг асаана уу." + автомат дахин оролдох |
| 2 | **Төхөөрөмж алга** | `USB_STATUS = DISCONNECTED` | "Уншигчийг USB-д залгана уу" |
| 3 | **Бэлэн** | `USB_STATUS = CONNECTED` + `DEVICE_INFO` | "Хуруугаа уншигч дээр тавина уу". Model, serial-ыг жижиг үсгээр харуулна |
| 4 | **Уншиж байна** | `FINGER_PLACED` | Spinner / "Уншиж байна..." |
| 5 | **Зураг ирсэн** | `FINGER_IMAGE` | Хурууны зургийг харуулна |
| 6 | **Хуруу авсан** | `FINGER_REMOVED` | Бэлэн төлөв рүү буцна (зураг үлдээж болно) |
| 7 | **Бүртгэл 1/3, 2/3, 3/3** | `ENROLL_STARTED`, `ENROLL_PROGRESS` | Progress: ●○○, ●●○ |
| 8 | **Дахин тавих** | `ENROLL_RETRY` | `DIFFERENT_FINGER`: "Өмнөхтэй ижил хуруугаа тавина уу". `POOR_QUALITY`: "Хуруугаа дарж, зөв тавина уу" |
| 9 | **Амжилттай** | `ENROLL_SUCCESS` | Ногоон тэмдэг, template-ийг backend руу илгээнэ |
| 10 | **Алдаа** | `ENROLL_FAILED`, `ERROR` | Улаан мессеж + "Дахин оролдох" товч |

Төлвийн дүрэм:
- Хуудас нээгдэх бүрт snapshot ирнэ. Тиймээс эхний төлвийг event-ээс тодорхойл, хатуу кодлож болохгүй.
- Бүртгэл явж байх үед төхөөрөмж салбал `ENROLL_FAILED`/`DEVICE_LOST` ба `USB_STATUS = DISCONNECTED` ирнэ. Төлөв 2 руу шилж.
- Бүртгэл эхлүүлэх товчийг зөвхөн төхөөрөмж холбогдсон (`CONNECTED`) үед идэвхтэй болго.

## 6. Дахин холбогдох (auto-reconnect)

Агент эхлээгүй, restart болж байх, эсвэл сүлжээ тасрах үед socket хаагдана. Клиент өөрөө сэргээх ёстой:

- `onclose` дээр 1-3 секундын дараа дахин холбогдоно (жишээ нь exponential backoff, дээд тал нь 5 сек).
- Холбогдсон даруйд snapshot ирнэ. Нэмэлт команд илгээх шаардлагагүй.
- Холбогдоогүй хугацаанд дэлгэц "Агент унтарсан" төлөвт байна.

## 7. Жишээ код (JavaScript)

```js
const WS_URL = 'ws://127.0.0.1:8089';

class FingerprintClient {
  constructor(onEvent, onState) {
    this.onEvent = onEvent;   // (msg) => void, msg = {eventType, payload, version, serial}
    this.onState = onState;   // (isAgentOnline) => void
    this.retryMs = 1000;
    this.connect();
  }

  connect() {
    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    ws.onopen = () => {
      this.retryMs = 1000;
      this.onState(true);
    };

    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      this.onEvent(msg);
    };

    ws.onclose = () => {
      this.onState(false);
      setTimeout(() => this.connect(), this.retryMs);
      this.retryMs = Math.min(this.retryMs * 2, 5000);
    };

    ws.onerror = () => ws.close();
  }

  send(cmd) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(cmd);
  }

  startEnroll()  { this.send('CMD_ENROLL_START'); }
  cancelEnroll() { this.send('CMD_ENROLL_CANCEL'); }
  refresh()      { this.send('CMD_STATUS'); }
}

// Хэрэглээ
const client = new FingerprintClient(
  (msg) => {
    switch (msg.eventType) {
      case 'USB_STATUS':
        setDevicePresent(msg.payload === 'CONNECTED');
        break;
      case 'DEVICE_INFO':
        showDevice(msg.payload.model, msg.payload.serial);
        break;
      case 'FINGER_PLACED':
        showReading();
        break;
      case 'FINGER_IMAGE':
        img.src = 'data:image/png;base64,' + msg.payload;
        break;
      case 'FINGER_REMOVED':
        showReady();
        break;
      case 'ENROLL_STARTED':
        showEnroll(0, msg.payload.total);
        break;
      case 'ENROLL_PROGRESS':
        showEnroll(msg.payload.count, msg.payload.total);
        break;
      case 'ENROLL_RETRY':
        showRetry(msg.payload.reason);
        break;
      case 'ENROLL_SUCCESS':
        saveTemplateToBackend(msg.serial, msg.payload); // payload = base64 template
        showSuccess();
        break;
      case 'ENROLL_FAILED':
        showError(msg.payload.reason);
        break;
      case 'ENROLL_CANCELLED':
        showReady();
        break;
      case 'ERROR':
        showError(msg.payload.code);
        break;
    }
  },
  (online) => setAgentOnline(online)
);
```

## 8. Анхаарах зүйлс

1. **Payload-ийн төрөл холимог.** `USB_STATUS`, `FINGER_IMAGE`, `ENROLL_SUCCESS` нь string, `DEVICE_INFO`, `ENROLL_*` (SUCCESS-ээс бусад) нь object. Event бүрээр нь зөв задал.
2. **`FINGER_IMAGE` хуруу тавьсан бүрт нэг удаа** ирнэ, тасралтгүй урсгал биш. Зураг нь PNG (300x375 орчим).
3. **`FINGER_REMOVED` саатлагдана** (1-2 сек хүртэл). Хуруу авмагц шууд ирнэ гэж бодож UX бүү бүтээ, ялангуяа `FINGER_PLACED` -> `FINGER_REMOVED` хоорондох цагийг таймераар хэмжиж болохгүй.
4. **Давхар бүртгэл (duplicate) илрүүлэлт байхгүй.** Агент нэг хурууг дахин бүртгэхийг хаадаггүй. Давхардлыг backend шалгана.
5. **Template нь base64 string.** Хэрэглэгчийн мэдээлэлтэй хамт backend-д хадгалахдаа serial-ыг (аль төхөөрөмжөөр авсныг) бас хадгалж болно.
6. **Serial нь DISCONNECTED үед хоосон.** Салсан event-ээс serial уншиж төхөөрөмжийг тодорхойлох гэж оролдож болохгүй. Өмнөх мэдэгдэж байсан утгыг ашигла.
7. **Олон клиент.** Нэг клиент `CMD_ENROLL_START` өгвөл бүх клиент `ENROLL_*` event хүлээн авна. Хоёр хүн зэрэг бүртгэл хийхээс сэргийлэхийг UI-д анхаар.
8. **Аюулгүй байдал.** Агент одоогоор `0.0.0.0:8089` дээр сонсдог, өөрөөр хэлбэл LAN-ийн хэн ч холбогдож болно. Клиент ба агент нэг компьютер дээр бол агентийг `127.0.0.1` дээр сонсуулахыг зөвлөж байна. Мөн хуудас HTTPS байвал `ws://127.0.0.1` нь браузерт зөвшөөрөгддөг (localhost онцгой тохиолдол), харин LAN IP руу `ws://` нь mixed-content-оор блоклогдоно.

## 9. Хурдан шалгах арга

Агент ажиллаж байхад браузерийн консолд:

```js
const ws = new WebSocket('ws://127.0.0.1:8089');
ws.onmessage = e => console.log(JSON.parse(e.data));
ws.onopen = () => ws.send('CMD_STATUS');
```

Хүлээгдэх хариу: `CONNECTED`, `USB_STATUS`, `DEVICE_INFO`, дараа нь `CMD_STATUS`-ийн хариу.
