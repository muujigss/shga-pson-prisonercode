const fs = require('fs');
const path = require('path');

const localesDir = 'd:\\projects\\New folder\\shga-pson-prisonercode\\i18n\\locales';

const mn_data = {
  legal: {
    title: 'ШИНЭЭР ИРСЭН ХОРИГДОЛД ТАНИЛЦУУЛАХ ХУУЛЬ, ЖУРАМ',
    intro: 'Шүүхийн шийдвэр гүйцэтгэх тухай Монгол улсын хуулийн 210-р зүйл  хоригдлын эрх, 211-р зүйлд хоригдлын үүрэг болон  бусад хууль тогтоомж, журмын заалтыг тус тус  уншуулж танилцууллаа.',
    rights: {
      title: '210.1 Хоригдол дараах эрх эдэлнэ.',
      item1: '210.1.1 Хорих ял эдлэх нөхцөл журам, эрх үүрэг, хязгаарлалтын талаар мэдээлэл авах',
      item2: '210.1.2 хорих ангийн захиргаагаар дамжуулан өөрт холбогдох асуудлаар аль ч байгууллага, албан тушаалтанд өргөдөл, гомдол гаргах',
      item3: '210.1.3 өмгөөллийн болон хууль зүйн туслалцаа авах',
      item4: '210.1.4 холбогдох зардлаа өөрөө хариуцаж, хорих байгууллагаас тогтоосон газарт  шинжлэх ухаан, утга зохиол урлагийн бүтээл туурвих',
      item5: '210.1.5 эмнэлгийн тусламж авах',
      item6: '210.1.6 Энэ хуульд заасны дагуу гэр бүлийн гишүүнтэй удаан, бусад хүнтэй түр хугацаагаар уулзах, суурин утас, захидлаар харилцах, илгээмж авах, өөрийн нэрийн дансаар дамжуулж мөнгөн гуйвуулга авах явуулах',
      item7: '210.1.7 өөрийн зардлаар өдөр тутмын сонин сэтгүүл захиалах, хорих анги дахь номын санг үнэ төлбөргүй  ашиглах',
      item8: '210.1.8 урьд тогтоолгосон тэтгэвэр, тэтгэмжээ үргэлжлүүлэн авах, хуульд заасан болзол шаардлагыг хангасан тохиолдолд хуулиар тогтоосон тэтгэвэр, тэтгэмж тогтоолгох',
      item9: '210.1.9 хорих байгууллагын албан хаагч, эрх бүхий албан тушаалтны зүгээс хүнлэг харьцах, эсвэл хэрцгий хүнлэг бус нэр төрийг нь доромжилж харьцахгүй байхыг шаардах',
      item10: '210.1.10 хувийн аюулгүй байдлаа хамгаалуулах',
      item11: '210.1.11 өөрөө зөвшөөрсөн эсэхээс үл хамааран эрүүл мэндэд нь эрсдэл учруулж болзошгүй аливаа туршилтаас ангид байх',
      item12: '210.1.12 энэ хуульд заасан журмын дагуу зөвшөөрөгдсөн тоо хэмжээний хоол, хүнсний бүтээгдэхүүн, ахуйн болон нэн тэргүүний бусад зүйл худалдан авах',
      item13: '210.1.13 шашны зан үйл үйлдэх',
      item14: '210.1.14 өөрийн зардлаар их дээд сургууль, коллежийн эчнээ сургалтанд хамрагдах',
      item15: '210.1.15 хуваарилагдан очсон хорих ангийн байршил, холбоо барих мэдээллийн талаар гэр бүлийн гишүүнд мэдэгдэх'
    },
    duties: {
      title: '211.1 Хоригдол дараах үүрэг хүлээнэ.',
      item1: '211.1.1 хорих ангид мөрдөх хууль тогтоомж, тэдгээрт нийцүүлэн эрх бүхий албан тушаалтнаас баталсан дүрэм,журам хорих  байгууллага, албан хаагчийн тавьсан хууль ёсны шаардлагыг заавал биелүүлэх',
      item2: '211.1.2 хорих байгууллагаас тогтоосон цагийн хуваарьт үйл ажиллагааг мөрдөх',
      item3: '211.1.3 хорих байгууллагын алба хаагчаас даалгасан ажлыг заавал гүйцэтгэх, хөдөлмөр хамгаалал аюулгүй ажиллагааны журмыг чанд сахих',
      item4: '211.1.4 тогтоосон журмын дагуу зохион байгуулж байгаа сургалтанд хамрагдах',
      item5: '211.1.5 эрүүл мэндээ хамгаалах, эмчийн зөвлөгөө шаардлагыг биелүүлэх, хуурамчаар болон санаатайгаар өвчилсөн, эрүүл мэнд бие эрхтэндээ гэмтэл учруулсан бол холбогдох зардлыг төлөх',
      item6: '211.1.6 эзэмшиж байгаа эд хөрөнгө, хөдөлмөрийн багаж хэрэгсэл, тоног төхөөрөмжийг зориулалтын дагуу ашиглах, эвдэж гэмтээхгүй байх',
      item7: '211.1.7 гэмт хэрэг зөрчил үйлдэхэд уриалах, өдөөн хатгах, зохион байгуулах, идэвхтэй үйлдэл, эс үйлдэл гаргахгүй байх',
      item8: '211.1.8.хорих байгууллагын алба хаагч, эрх бүхий албан тушаалтан, бусад хоригдол болон хорих байгууллагад байгаа бусад хүнтэй хүндэтгэлтэй харьцах;',
      item9: '211.1.9.эрүүл ахуй, ариун цэврийн шаардлагыг сахих.',
      desc1: '211.2.Хорих ангид суулт хийх, өлсгөлөн зарлах, хоригдол хөдөлгөөнт утас ашиглах, хадгалах болон бэлэн мөнгө, валют, үнэт зүйл ашиглах, хадгалахыг хориглоно.',
      desc2: '211.3.Хоригдол энэ хуульд заасан эрхээ эдлэхдээ энэ хууль, хорих ангийн дотоод журам болон бусад хоригдол, хорих ангийн алба хаагчийн эрх, хууль ёсны ашиг сонирхлыг зөрчихгүй байх үүрэгтэй.',
      desc3: '211.4.Хорих ял эдэлж байгаа гадаадын иргэн энэ зүйлд заасан эрх эдэлж, үүрэг хүлээхийн зэрэгцээ гадаад хэргийн асуудал хариуцсан төрийн захиргааны төв байгууллагын консулын асуудал хариуцсан нэгжээр дамжуулан өөрийн улсын Дипломат төлөөлөгчийн газрын ажилтантай уулзах, харилцах эрхтэй'
    },
    meetings: {
      title: 'ШШГТХууль 213 дугаар зүйл.Хоригдол бусадтай уулзах, харилцах',
      item1: '213.1.Хоригдол зохих хяналтад эхнэр, нөхөр, хүүхэд, төрсөн болон хадам эцэг, эх, төрсөн ах, эгч, дүү, өвөг эцэг, эмэг эх, нэг ам бүлд хамт амьдардаг ач, зээтэй удаан, бусад хүнтэй түр хугацааны уулзалт хийж болно.',
      item2: '213.2.Хорих ангийн дарга түр хугацааны уулзалтын үргэлжлэх хугацаа 3 цаг хүртэл, удаан хугацааны уулзалтын үргэлжлэх хугацаа 72 цаг хүртэл байхаар тогтоох бөгөөд холбогдох зардлыг хоригдол, эсхүл удаан хугацааны уулзалт хүссэн этгээд хариуцна.',
      item3: '213.3.Удаан хугацаагаар уулзах хүн түүний гэр бүлийн гишүүн мөн болохыг нотолсон хууль ёсны баримт бичигтэй байна.',
      item4: '213.4.Хорих байгууллагын эрх бүхий албан тушаалтан хорих ангийн болон хоригдлын аюулгүй байдлыг хангах зорилгоор хоригдлын захидал, илгээмжид үзлэг хийнэ.',
      item5: '213.5.Хоригдлын нэг удаа утсаар ярих хугацаа 5 минутаас илүүгүй байна.',
      item6: '213.6.Хоригдол захидал илгээх, утсаар ярих, удаан хугацааны уулзалт хийх зардлаа өөрөө хариуцна.'
    },
    communication: {
      title: 'Хоригдол бусадтай харилцах (Хорих ангийн дотоод журмаас)',
      item1: '18.1.Хоригдол албан хаагчдтай харьцахдаа түүний албан тушаал, эсвэл цолыг хэлж, өөрийн овог нэр, шийтгүүлсэн эрүүгийн хуулийн зүйл, хэсгийг танилцуулж, хүсэлт гомдолоо товч тодорхой илэрхийлнэ.',
      item2: '18.2.Хоригдолууд хоорондоо иргэдийн адилаар бие биенээ “Та”  гэж харьцах ба бусадтай харилцахдаа ёс бус үг хэллэг хэлэхгүйгээр соёлч болосон харьцана.',
      item3: '18.3.Гадаад улсын харьяат  хоригдолтой харьцахдаа тухайн улсын соёл ёс заншлыг хүндэтгэнэ.'
    },
    rewards: {
      title: 'ШШГТХууль 223 дугаар зүйл.Хоригдлыг урамшуулах',
      item1: '223.1.1.энэ хуульд заасан түр, удаан хугацааны уулзалтын тоог 45 хоногт тус бүр нэгээр нэмэгдүүлэх;',
      item2: '223.1.2.хуульд заасан журмын дагуу шагналын хоног олгох;',
      item3: '223.1.3.хорих ангийн дотоод журмын дагуу хориглоогүй үнэ бүхий эд зүйлээр урамшуулна.'
    },
    search: {
      title: 'ШШГТХууль 232 дугаар зүйл.Хоригдлын бие, эд зүйл, хорих өрөөнд үзлэг, нэгжлэг хийх',
      item1: '232.1.Хоригдлын бие, байр, түүний ойр орчинд албан хаагч ямар ч үед үзлэг, нэгжлэг хийж болно.',
      item2: '232.2.Хоригдлын биед хийх үзлэг, нэгжлэгийг хоригдолтой ижил хүйсний алба хаагч гүйцэтгэнэ.'
    },
    allowed: {
      title: 'Хоригдолд зөвшөөрөх, хориглох зүйл  (Хорих ангийн дотоод журмаас)',
      item1: '7.1.1. ариун цэврийн хэрэгсэл (оо, сойз, гар нүүрийн болон эдийн саван, алчуур, сахлын машин, жижиг хэмжээтэй 1 үйлдэлтэй хумсны хутга, нүүр гарын тос, нойтон салфетка, ариун цэврийн цаас, эмэгтэй хоригдлын хувьд ариун цэврийн хэрэглэл, гоо сайхны хэрэгсэл)',
      item2: '7.1.2. энгийн бугуйн цаг',
      item3: '7.1.3. аллага, хүчирхийлэл, садар самууныг сурталчилснаас бусад сонин, ном сэтгүүл 5-аас дээшгүй.',
      item4: '7.1.4. хорих байгуулагаас олгосон нэг загварын хувцас болон ээлжийн дотуур хувцас, ноосон өмд, цамц.',
      item5: '7.1.5. спорт хослол /нэг ээлжийн/',
      item6: '7.1.6. өвлийн ноосон, зуны саравчтай малгай 1 ширхэг.',
      item7: '7.1.7. гэр бүлийн гишүүдийн фото зураг (5 ширхэгээс илүүгүй)',
      item8: '7.1.8. эмчийн зөвшөөрлөөр олгосон эмийг тухайн өдрийн хэрэглэх тунгаар',
      item9: '7.1.9. утаат тамхи (янжуур) 20 ширхэгээс илүүгүй.',
      item10: '7.1.10. ус уух зориулалттай 250 мл-аас ихгүй багтаамжтай хуванцар аяга 1 ширхэг.',
      item11: '7.1.11. ахмад настан, хөгжлийн бэрэхшээлтэй хоригдлын хувьд түүний протез, ортопедийн хэрэгсэл.',
      desc1: '7.2. Энэ журмын 7.1-д зааснаас бусад эд зүйлсийг хоригдол биедээ болон хорих өрөөнд  балгахыг хориглох ба бусад эд зүйлийг хадгаламжийн нэгжид хадгална.',
      desc2: '7.3. Хаалттай хорих ангийн тусгай нэгжид ял эдлэж буй хоригдол энэ журмын 7.1.9  дэх заалт, бусад хоригдол 7.1.10 дахь заалт хамаарахгүй.',
      desc3: '7.4. Хоригдлыг бялдаржуулах болон бие хамгаалах чиглэлээр хичээллэх нөхцөл боломжоор хангахгүй.'
    },
    schedule: {
      title: 'Хорих ангид мөрдөх цагийн хуваарьт үйл ажиллагаа (Хорих ангийн дотоод журмаас)',
      item1: '13.1. Хорих ангийн дарга хорих ангид мөрдөх цагийн хуваарийг батална.',
      item2: '13.2. Цагийн хуваарьт өглөө босохоос эхлэн ариун цэвэр сахих, сургалт нийгэмшүүлэх ажил, хөдөлмөрлөх, хоолох, хэсэгчилсэн болон нэгдсэн бүртгэл хамрагдах, чөлөөт цаг, амрах хүртэлх бүхий л үйл ажиллагааг тусгах ба нийт хоригдол зайлшгүй хамрагдана.',
      item3: '13.3. Хоригдол өглөө босон ариун цэврээ сахиж, ороо хураасны дараа түүнийг хорих өрөөнөөс гарган, өрөөний хаалгыг цоожлон нэгдсэн бүртгэл явуулна.',
      item4: '13.4. Нийгмийн ажилтан хоригдолд хөдөлмөр эрхлэх, албадан сургалтаас бусад сургалтад хамрагдах талаар санал болгох хуудас танилцуулж, зөвшөөрсөн эсэх талаар гарын үсэг зурна.',
      item5: '13.5. Цагийн хуваарийн дагуу явагдаж буй хөдөлмөр, сургалтын үед тэдгээрт хамрагдахаас татгалзсан хоригдлыг тогтоосон цэгт харуул хамгаалалтын хяналтад байршуулан хариуцсан нийгмийн ажилтан нь сургалт, хөдөлмөрт хамрагдахын ач холбогдол, хуулиар олгодсон эрх зүйн боломжийн талаар яриа, таниулга хийнэ.',
      item6: '13.6. Хорих өрөөний хаалгыг цоожтой байлгах ба амрах үед хоригдлыг амрах өрөөнд нэвтрүүлнэ. Хувийн чөлөөт цагаар хорих өрөөний  хаалгыг цоожтой байлгах эсэхийг хорих ангийн дарга шийдвэрлэнэ.',
      item7: '13.7. Хоригдлын эрүүл мэндийг хамгаалах, хөдөлгөөний дутагдлаас сэргийлэх зорилгоор өдөр бүр 30 минутаас доошгүй хугацаанд хөдөлгөөний дасгал хийлгэнэ.'
    },
    security: {
      title: 'ХОРИХ БАЙГУУЛЛАГЫН АЛБА ХААГЧИЙН АЮУЛГҮЙ БАЙДЛЫГ ХАНГАХ АЮУЛГҮЙН ТОЙРОГ ТОГТООХ ЖУРМЫГ ХОРИГДОЛД ТАНИЛЦУУЛСАН ТУХАЙ ТЭМДЭГЛЭЛ\n\nХоёр. Алба хаагчийн аюулгүйн тойргийн хэмжээ,  түүнийг тогтоох',
      item1: '2.1. Алба хаагчийн аюулгүйн тойрог нь түүний эргэн тойронд 2 метр зайд байна.',
      item2: '2.2. Аюулгүйн тойрогт хорих байгууллагын хамгаалалтын бүс, алба хаагчийн ажил үүрэгээ гүйцэтгэж байгаа ажлын байр /албан өрөө/ нэгэн адил хамаарна.',
      item3: '2.3. Алба хаагч нь ажлын шаардлагаар хоригдогчтой ойроос харьцах тохиолдолд аюулгүй байдлыг хангаж, хоригдогчид урдьчилан анхааруулна.',
      item4: '2.4. Оргосон хоригдогчийг баривчлах, хоригдогчийг хуяглан хүргэх үед энэ журмын 2.3-т заасныг баримтална.',
      item5: '2.5. Нэгдсэн болон хяналтын бүртгэл явуулах, үзлэг, нэгжлэг хийх, хоригдогчийн оролцоотой зохион байгуулагдаж байгаа нэгдсэн үйл ажиллагааны үед алба хаагчийн аюулгүй байдлыг хангах арга хэмжээг авч, хөдөлгөөнийг хязгаарласны дараа үйл ажиллагааг зохион байгуулна.',
      item6: '2.6. Хорих байгууллагад шинээр ирсэн хоригдогчид энэхүү журмыг  урьдчилан танилцуулах бөгөөд зөрчвөл Шүүхийн шийдвэр гүйцэтгэх тухай хуулийн 294 дүгээр зүйлд заасан арга хэмжээ авах тухай мэдэгдэж, гарын үсэг зуруулан баримтжуулан хувийн хэрэгт хавсаргана.',
      violation: 'Дөрөв. Журам зөрчигчид хүлээлгэх хариуцлага',
      violation1: '4.1. Хоригдогч аюулгүйн тойрогт зөвшөөрөлгүй нэвтэрсэн, хөдөлгөөнийг хориглосон тэмдэглэгээг зөрчсөн бол зөрчлийн шинж байдлыг харгалзан Шүүхийн шийдвэр гүйцэтгэх тухай хуулийн 293 дугаар зүйлд заасан нэг бүрийн тусгай хэрэгсэл хэрэглэх буюу 227 дугаар зүйлд заасан сахилгын шийтгэл оногдуулна.'
    },
    movement: {
      title: 'Арван хоёр. Хоригдлын байршил, хөдөлгөөн чиглэл (Хорих ангийн дотоод журмаас)',
      item1: '12.1. Хоригдлын байршил, хөдөлгөөн, чиглэлийг хорих ангийн даргын тушаалаар баталж мөрдөнө.',
      item2: '12.2. Хоригдлын \"байршил\" гэж хорих ангийн цагын хуваарьт заагдсан тодорхой газарт хоригдол байлгахыг хэлнэ.',
      item3: '12.3. Байршлыг хоригдлын тоог харгалзан сургалт, хөдөлмөрийн чиглэлээр хэсэгт хуваан тогтоож болно.',
      item4: '12.4. Хоригдлын \"хөдөлгөөн\" гэж хорих ангийн цагийн хуваарийн дагуу өглөө босхоос эхлэн ариун цэвэр сахих, хооллох хөдөлмөрлөх, сургалт, яриа таниулгад хамрагдах, түр болон удаан хугацааны уулзалт, чөлөөт цаг, амрах хүртэл үйл ажиллагааг хэлнэ.',
      item5: '12.5. Хорих ангийн цагийн хуваарийн дагуу хоригдол нь амьдралын болон үйлдвэрлэлийн бүсэд явж болох зөвшөөрөгдсөн замыг \"чиглэл\" гэнэ.',
      item6: '12.6. Хоригдлын явах чиглэлийг түүний хөдөлмөр эрхлэлт, засрал хүмүүжлийн түвшин харгалзан хэсгээр болон хоригдол нэг бүрээр тогтоож болно.'
    },
    discipline: {
      title: 'ШШГТХууль 227дугаар зүйл.Хоригдолд хүлээлгэх сахилгын шийтгэл',
      desc1: '227.1.Хоригдол хууль тогтоомж, хорих ангид тогтоосон дэглэм, журам, хуулиар хүлээлгэсэн үүргийг зөрчсөн бол түүнд хорих ангийн даргын шийдвэрээр дараахь сахилгын шийтгэл оногдуулна:',
      item1: '227.1.1.хоног, сар, улирал, жилд авах түр, удаан хугацааны уулзалт, эсхүл утсаар ярих эрхийг 3 сар хүртэл хугацаагаар хасах;',
      item2: '227.1.2.сахилгын байранд хорих;',
      item3: '227.1.3.тухайн сар, улирал, жилд олгосон шагналын хоногийг хасах.',
      desc2: '227.2.Хоригдлын хорих ангийн дотоод журмыг зөрчсөн үйлдэл, эс үйлдэхүй нь гэмт хэргийн шинжтэй гэх хангалттай үндэслэл байгаа тохиолдолд хорих ангийн дарга прокурорт мэдэгдэж, нутаг дэвсгэр хариуцсан цагдаагийн байгууллагад шилжүүлэн шалгуулна.',
      desc3: '227.3.Сахилгын нэг зөрчил гаргасан хоригдолд энэ хуулийн 227.1-д заасан шийтгэлийг давхардуулан оногдуулахыг хориглоно'
    }
  }
};

const en_data = {
  legal: {
    title: 'LAWS AND REGULATIONS TO BE INTRODUCED TO NEW PRISONERS',
    intro: 'Introduced Article 210 of the Law of Mongolia on Court Decision Enforcement regarding prisoner rights, Article 211 on prisoner duties, and other related laws and regulations.',
    rights: {
      title: '210.1 A prisoner shall enjoy the following rights:',
      item1: '210.1.1 To receive information on the conditions, regulations, rights, duties, and restrictions of imprisonment',
      item2: '210.1.2 To submit applications and complaints to any organization or official regarding issues concerning themselves through the prison administration',
      item3: '210.1.3 To receive advocacy and legal assistance',
      item4: '210.1.4 To engage in scientific, literary, and artistic creation at a designated place by the prison administration, covering their own expenses',
      item5: '210.1.5 To receive medical assistance',
      item6: '210.1.6 To have long-term meetings with family members and short-term meetings with others, to communicate via landline and letters, receive parcels, and send/receive money transfers through their own account as specified in this law',
      item7: '210.1.7 To subscribe to daily newspapers and magazines at their own expense, and to use the prison library free of charge',
      item8: '210.1.8 To continue receiving previously established pensions and allowances, and to establish pensions and allowances specified by law if they meet the legal requirements',
      item9: '210.1.9 To demand humane treatment from prison officials and authorized personnel, and not to be treated in a cruel, inhuman, or degrading manner',
      item10: '210.1.10 To have their personal security protected',
      item11: '210.1.11 To be free from any experiments that may pose a risk to their health, regardless of whether they have consented',
      item12: '210.1.12 To purchase food, groceries, household items, and other essential items in the permitted quantities according to the procedures specified in this law',
      item13: '210.1.13 To perform religious rituals',
      item14: '210.1.14 To enroll in distance learning at a university or college at their own expense',
      item15: '210.1.15 To notify family members about the location and contact information of the assigned prison'
    },
    duties: {
      title: '211.1 A prisoner shall bear the following duties:',
      item1: '211.1.1 To strictly comply with the laws and regulations to be followed in the prison, the rules and regulations approved by the authorized official in accordance with them, and the lawful demands made by the prison administration and officials',
      item2: '211.1.2 To follow the scheduled activities set by the prison administration',
      item3: '211.1.3 To mandatory perform the tasks assigned by the prison officials, and strictly observe the rules of labor protection and safety',
      item4: '211.1.4 To participate in training organized in accordance with established procedures',
      item5: '211.1.5 To protect their health, follow doctors advice and requirements, and pay the related costs if they intentionally or fraudulently cause illness or injury to their health or body',
      item6: '211.1.6 To use property, labor tools, and equipment in their possession for their intended purpose and not to damage them',
      item7: '211.1.7 Not to urge, provoke, organize, or take active action or inaction to commit crimes or offenses',
      item8: '211.1.8 To treat prison officials, authorized personnel, other prisoners, and other persons in the prison with respect;',
      item9: '211.1.9 To observe hygiene and sanitation requirements.',
      desc1: '211.2 It is prohibited to sit-in, go on a hunger strike, use or keep mobile phones, and use or keep cash, currency, and valuables in prison.',
      desc2: '211.3 When exercising the rights specified in this law, the prisoner is obliged not to violate this law, the internal rules of the prison, and the rights and legitimate interests of other prisoners and prison officials.',
      desc3: '211.4 A foreign citizen serving a prison sentence, in addition to enjoying the rights and bearing the duties specified in this article, has the right to meet and communicate with the staff of the Diplomatic Mission of their country through the consular unit of the central state administrative body in charge of foreign affairs.'
    },
    meetings: {
      title: 'Law on Court Decision Enforcement, Article 213. Meetings and communication of prisoners with others',
      item1: '213.1 A prisoner may have a long-term meeting with a spouse, child, biological and parents-in-law, biological sibling, grandparent, and grandchildren living together in one family, and a short-term meeting with other persons under appropriate supervision.',
      item2: '213.2 The head of the prison shall determine the duration of short-term meetings up to 3 hours and long-term meetings up to 72 hours, and the relevant costs shall be borne by the prisoner or the person requesting the long-term meeting.',
      item3: '213.3 A person meeting for a long time shall have legal documents proving that they are a family member.',
      item4: '213.4 The authorized official of the prison shall inspect the prisoner\'s letters and parcels to ensure the safety of the prison and the prisoner.',
      item5: '213.5 A prisoner\'s single phone call duration shall not exceed 5 minutes.',
      item6: '213.6 A prisoner shall bear the costs of sending letters, making phone calls, and having long-term meetings.'
    },
    communication: {
      title: 'Prisoner communication with others (From the internal rules of the prison)',
      item1: '18.1 When a prisoner communicates with an official, they shall state their position or rank, introduce their full name, the article and paragraph of the Criminal Code they were sentenced under, and briefly and clearly express their requests and complaints.',
      item2: '18.2 Prisoners shall address each other respectfully like citizens, using "You" (formal), and communicate culturally without using profane words when communicating with others.',
      item3: '18.3 When communicating with a foreign citizen prisoner, the culture and customs of that country shall be respected.'
    },
    rewards: {
      title: 'Law on Court Decision Enforcement, Article 223. Rewarding prisoners',
      item1: '223.1.1 increase the number of short and long-term meetings specified in this law by one each per 45 days;',
      item2: '223.1.2 grant reward days in accordance with the procedure specified by law;',
      item3: '223.1.3 reward with items of value not prohibited by the internal rules of the prison.'
    },
    search: {
      title: 'Law on Court Decision Enforcement, Article 232. Inspection and search of prisoner\'s body, belongings, and prison cell',
      item1: '232.1 Officials may inspect and search the prisoner\'s body, premises, and immediate surroundings at any time.',
      item2: '232.2 The inspection and search of the prisoner\'s body shall be performed by an official of the same sex as the prisoner.'
    },
    allowed: {
      title: 'Items permitted and prohibited for prisoners (From the internal rules of the prison)',
      item1: '7.1.1 sanitary items (toothpaste, toothbrush, hand/face and laundry soap, towel, razor, small 1-function nail clipper, face/hand cream, wet wipes, toilet paper, sanitary pads for female prisoners, cosmetics)',
      item2: '7.1.2 simple wristwatch',
      item3: '7.1.3 no more than 5 newspapers, books, magazines, except those promoting murder, violence, and pornography.',
      item4: '7.1.4 uniform clothes provided by the prison and a change of underwear, woolen pants, shirt.',
      item5: '7.1.5 sports suit /one set/',
      item6: '7.1.6 1 winter woolen hat and summer peaked cap.',
      item7: '7.1.7 photographs of family members (no more than 5 pieces)',
      item8: '7.1.8 medicine provided with the doctor\'s permission in the dose to be used on that day',
      item9: '7.1.9 no more than 20 cigarettes (cigarettes).',
      item10: '7.1.10 1 plastic cup for drinking water with a capacity of no more than 250 ml.',
      item11: '7.1.11 for elderly and disabled prisoners, their prosthesis and orthopedic equipment.',
      desc1: '7.2 Except for those specified in 7.1 of this regulation, it is prohibited for a prisoner to keep items on their body and in the prison cell, and other items shall be stored in the storage unit.',
      desc2: '7.3 Provision 7.1.9 of this regulation does not apply to a prisoner serving a sentence in a special unit of a closed prison, and provision 7.1.10 does not apply to other prisoners.',
      desc3: '7.4 Prisoners shall not be provided with conditions and opportunities to practice bodybuilding and self-defense.'
    },
    schedule: {
      title: 'Scheduled activities in prison (From the internal rules of the prison)',
      item1: '13.1 The head of the prison shall approve the schedule to be followed in the prison.',
      item2: '13.2 The schedule shall reflect all activities from waking up in the morning, maintaining sanitation, training and socialization work, labor, eating, participating in partial and general registration, free time, to resting, and all prisoners must participate.',
      item3: '13.3 After the prisoner wakes up in the morning, maintains sanitation, and makes their bed, they are taken out of the prison cell, the cell door is locked, and a general registration is conducted.',
      item4: '13.4 The social worker shall present the prisoner with a proposal form regarding employment and participation in training other than compulsory training, and the prisoner shall sign whether they agree or not.',
      item5: '13.5 Prisoners who refuse to participate in labor and training being conducted according to the schedule shall be placed under guard and security control at a designated point, and the responsible social worker shall conduct a conversation and presentation on the importance of participating in training and labor, and the legal opportunities provided by law.',
      item6: '13.6 The prison cell door shall be kept locked, and prisoners shall be allowed into the rest room during rest times. The head of the prison shall decide whether to keep the prison cell door locked during personal free time.',
      item7: '13.7 For the purpose of protecting the prisoner\'s health and preventing lack of movement, exercise shall be performed for at least 30 minutes every day.'
    },
    security: {
      title: 'RECORD ON INTRODUCING THE PROCEDURE FOR ESTABLISHING A SECURITY CIRCLE TO ENSURE THE SAFETY OF PRISON OFFICIALS TO THE PRISONER\n\nTwo. Size of the official\'s security circle and its establishment',
      item1: '2.1 The official\'s security circle is at a distance of 2 meters around them.',
      item2: '2.2 The security zone of the prison and the workplace /office/ where the official performs their duties belong equally to the security circle.',
      item3: '2.3 If an official has to interact closely with a prisoner due to work requirements, they shall ensure security and warn the prisoner in advance.',
      item4: '2.4 When arresting an escaped prisoner or escorting a prisoner under guard, the provisions of 2.3 of this regulation shall be followed.',
      item5: '2.5 When conducting general and control registration, inspection, search, and general activities involving prisoners, measures to ensure the official\'s safety shall be taken, and activities shall be organized after restricting movement.',
      item6: '2.6 Newly arrived prisoners at the prison shall be introduced to this regulation in advance, and if violated, they shall be informed of the measures to be taken as specified in Article 294 of the Law on Court Decision Enforcement, and they shall be required to sign and document it to be attached to their personal file.',
      violation: 'Four. Responsibility to be borne by violators of the regulation',
      violation1: '4.1 If a prisoner enters the security circle without permission or violates the signs prohibiting movement, special means for individuals specified in Article 293 of the Law on Court Decision Enforcement or disciplinary punishment specified in Article 227 shall be imposed depending on the nature of the violation.'
    },
    movement: {
      title: 'Twelve. Prisoner location, movement direction (From the internal rules of the prison)',
      item1: '12.1 The location, movement, and direction of prisoners shall be approved by the order of the head of the prison and followed.',
      item2: '12.2 The prisoner\'s "location" means keeping the prisoner in a specific place indicated in the prison schedule.',
      item3: '12.3 Location can be determined by dividing into groups based on the number of prisoners, training, and labor areas.',
      item4: '12.4 The prisoner\'s "movement" refers to all activities from waking up in the morning according to the prison schedule, maintaining sanitation, eating, labor, participating in training and talks, short and long-term meetings, free time, to resting.',
      item5: '12.5 The permitted route that a prisoner can take in the living and production zones according to the prison schedule is called a "direction".',
      item6: '12.6 The direction of the prisoner\'s movement can be determined by groups or for each prisoner individually, taking into account their employment and level of correction and upbringing.'
    },
    discipline: {
      title: 'Law on Court Decision Enforcement, Article 227. Disciplinary punishment imposed on prisoners',
      desc1: '227.1 If a prisoner violates laws and regulations, the regime and rules established in the prison, or the duties imposed by law, the following disciplinary punishments shall be imposed by the decision of the head of the prison:',
      item1: '227.1.1 deprive the right to short and long-term meetings or phone calls per day, month, quarter, and year for up to 3 months;',
      item2: '227.1.2 imprison in a disciplinary cell;',
      item3: '227.1.3 deduct the reward days granted for that month, quarter, or year.',
      desc2: '227.2 If there is sufficient reason to believe that the prisoner\'s action or inaction violating the internal rules of the prison has the nature of a crime, the head of the prison shall notify the prosecutor and transfer it to the police department in charge of the territory for investigation.',
      desc3: '227.3 It is prohibited to impose the punishments specified in 227.1 of this law simultaneously on a prisoner who has committed one disciplinary violation.'
    }
  }
};

const updateJson = (fileName, newData) => {
  const filePath = path.join(localesDir, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.legal = newData.legal;
  if (!data.dashboard) data.dashboard = {};
  if (!data.dashboard.menu) data.dashboard.menu = {};
  
  data.dashboard.menu.legal = fileName === 'mn.json' ? 'Эрх зүйн мэдээлэл' : 'Legal Information';
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

updateJson('mn.json', mn_data);
updateJson('en.json', en_data);
updateJson('ru.json', en_data);
updateJson('zh.json', en_data);

console.log('Done.');
