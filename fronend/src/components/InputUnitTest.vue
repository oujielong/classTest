<template>
  <a-form
    name="createQuestion"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
  >
    <a-form-item label="Choose qeustion Type">
      <a-select
        ref="select"
        v-model:value="formState.questionType"
        style="width: 120px"
        :options="formStateEumn.questionType"
        @change="handleChange"
      >
        <!-- <template #option="{ value, label }">
          <a-select-option v-for="(value, label) in formStateEumn.questionType"
              :key="label"
              :value="value">{{ label }}</a-select-option>
        </template> -->
      </a-select>
    </a-form-item>
    <template v-if="true" id="questionTitle">
      <a-form-item
        label="question Title"
        name="questionTitle"
      >
        <a-input v-model:value="formState.questionTitle" />
      </a-form-item>
      <a-form-item
        label="question Desctiption"
        name="desctiption"
        :rules="[{ required: false, message: 'Please input desctiption!' }]"
      >
        <a-input v-model:value="formState.desctiption" />
      </a-form-item>
    </template>

    <template v-if="caculateType == 'radio'">
      <a-form-item label="answer" name="optionsText" required>
        <a-input placeholder="x#B#C#D" v-model:value="formState.radio.optionsText" />
      </a-form-item>
      <a-form-item label="choose correct option" v-if="isAnswerFill">
        <a-radio-group
          v-model:value="formState.radio.correctAnswer"
          name="radioGroup"
        >
          <a-radio
            v-for="{ label, value } in singleOptions"
            :value="value"
            :key="label"
            >{{ label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
    </template>

    <!-- 最后的创建 -->
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" @click="onFinish" html-type="submit">Create</a-button>
    </a-form-item>
  </a-form>
</template>





<script setup>
import { reactive, computed } from "vue";
const formStateEumn = {
  questionType: [
    { value: "radio", label: "radio" },
    { value: "multiChoice", label: "multiChoice" },
    { value: "connection", label: "connection" },
    { value: "fillVacancy", label: "fillVacancy" },
    { value: "composition", label: "composition" },
  ],
};
const formState = reactive({
  questionType: "",
  questionTitle: "",
  desctiption: "",
  radio: {
    correctAnswer: "",
    optionsText: "",
  },
});

const handleChange = (values) => {
  console.log("change:", formState);
};
const onFinish = (values) => {
  console.log("Success:", formState);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const caculateType = computed(() => {
  return formState.questionType;
});
// 单选 ---- 选项的到分类自动计算
const singleOptions = computed(() => {
  return Array.from(new Set(formState.radio.optionsText?.split("#")))?.map(
    (item) => {
      return { label: item, value: item };
    }
  );
});
const isAnswerFill = computed(() => {
  return formState.radio.optionsText.length > 0;
});
</script>