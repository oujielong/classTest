<template>
  <a-form
    :model="formState"
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
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: 'Need the Tilte for this quesiton',
          },
          {
            max: 500,
            trigger: 'change',
            message: 'the max letter is 500',
          },
        ]"
      >
        <a-input v-model:value="formState.questionTitle" />
      </a-form-item>
      <a-form-item
        label="question Desctiption"
        name="desctiption"
        :rules="[
          {
            required: false,
            trigger: 'blur',
            message: 'Please input desctiption!',
          },
          {
            max: 500,
            trigger: 'change',
            message: 'the max letter is 500',
          },
        ]"
      >
        <a-input v-model:value="formState.desctiption" />
      </a-form-item>
    </template>
    <!-- 单选 -->
    <template v-if="caculateType == 'radio'">
      <a-form-item
        label="answer"
        :name="['radio', 'optionsText']"
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: 'Fill the options for this question',
          },
        ]"
      >
        <a-input
          placeholder="use '#' to separte the options, eg: A#B#C#D"
          v-model:value="formState.radio.optionsText"
        />
      </a-form-item>
      <a-form-item
        label="choose correct option"
        :name="['radio', 'correctAnswer']"
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: 'select the correct answer',
          },
        ]"
        v-if="formState.radio.optionsText"
      >
        <a-radio-group
          v-model:value="formState.radio.correctAnswer"
          name="radioGroup"
        >
          <a-radio
            v-for="{ label, value } in to_options(formState.radio.optionsText)"
            :value="value"
            :key="label"
            >{{ label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
    </template>
    <!-- 多选 -->
    <template v-if="caculateType == 'multiChoice'">
      <a-form-item
        label="answer"
        :name="['multiChoice', 'optionsText']"
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: 'Fill the options for this question',
          },
        ]"
      >
        <a-input
          placeholder="use '#' to separte the options, eg: A#B#C#D"
          v-model:value="formState.multiChoice.optionsText"
        />
      </a-form-item>
      <a-form-item
        label="choose correct option"
        :name="['multiChoice', 'correctAnswer']"
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: 'select the correct answer',
          },
        ]"
        v-if="formState.multiChoice.optionsText"
      >
        <a-checkbox-group
          v-model:value="formState.multiChoice.correctAnswer"
          :options="to_options(formState.multiChoice.optionsText)"
        >
          <template #label="{ label }">
            <span style="color: red">{{ label }}</span>
          </template>
        </a-checkbox-group>
      </a-form-item>
    </template>
    <!-- 最后的创建 -->
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" @click="onFinish" html-type="submit"
        >Create</a-button
      >
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
  multiChoice: {
    correctAnswer: [],
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
const to_options = (optionsText) => {
  return Array.from(new Set(optionsText?.split("#")))?.map((item) => {
    return { label: item, value: item };
  });
};
</script>