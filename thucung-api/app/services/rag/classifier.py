import re
from unicodedata import normalize


class QueryClassifier:
    categories = {
        "vaccination": {
            "vaccine",
            "vaccination",
            "vaccinated",
            "shot",
            "shots",
            "tiem",
            "tiêm",
            "vacxin",
            "vắc",
            "phong",
        },
        "lab_result": {
            "blood",
            "test",
            "lab",
            "xet",
            "xét",
            "nghiem",
            "nghiệm",
            "creatinine",
            "kidney",
            "gan",
            "thận",
            "than",
            "máu",
            "mau",
        },
        "prescription": {
            "medicine",
            "medication",
            "drug",
            "dose",
            "dosage",
            "prescription",
            "thuoc",
            "thuốc",
            "don",
            "đơn",
            "lieu",
            "liều",
        },
        "symptom": {
            "symptom",
            "sick",
            "vomit",
            "diarrhea",
            "fever",
            "cough",
            "trieu",
            "triệu",
            "chung",
            "chứng",
            "benh",
            "bệnh",
            "non",
            "nôn",
            "sot",
            "sốt",
        },
        "diet": {
            "food",
            "diet",
            "eat",
            "nutrition",
            "thuc",
            "thức",
            "an",
            "ăn",
            "dinh",
            "dưỡng",
            "duong",
        },
        "image": {"image", "photo", "picture", "anh", "ảnh", "hinh", "hình"},
    }

    def normalize_text(self, value: str) -> str:
        text = normalize("NFKC", value or "").lower()
        return re.sub(r"\s+", " ", text).strip()

    def classify(self, text: str, labels: list[str] | None = None, document_type: str | None = None) -> set[str]:
        haystack = self.normalize_text(" ".join([text or "", document_type or "", " ".join(labels or [])]))
        matched = set()
        for category, keywords in self.categories.items():
            if any(keyword in haystack for keyword in keywords):
                matched.add(category)
        return matched
