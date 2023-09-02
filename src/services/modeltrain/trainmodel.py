# import tensorflow as tf
# import tensorflow_addons as tfa
# import tensorflow_datasets as tfds

# # Data preprocessing (using the preprocessing function from before)
# def preprocess(sample):
#     image = sample['image']
#     bbox = sample['objects']['bbox']
#     label = sample['objects']['label']
#     image = tf.image.resize(image, (224, 224))
#     image = image / 255.0
#     return image, {'bbox': bbox, 'label': label}

# # Load and preprocess the data
# raw_train_dataset = tfds.load('coco/2017', split='train', as_supervised=False)
# train_dataset = raw_train_dataset.map(preprocess).batch(32).shuffle(1000).prefetch(tf.data.experimental.AUTOTUNE)

# # Build the model
# base_model = tf.keras.applications.ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
# x = base_model.output
# x = tf.keras.layers.GlobalAveragePooling2D()(x)
# x = tf.keras.layers.Dense(1024, activation='relu')(x)
# bbox_output = tf.keras.layers.Dense(4, activation='sigmoid', name='bbox_output')(x)  # Bounding box output
# class_output = tf.keras.layers.Dense(91, activation='softmax', name='class_output')(x)  # Class label output

# model = tf.keras.models.Model(inputs=base_model.input, outputs=[bbox_output, class_output])

# # Use Focal Loss
# focal_loss = tfa.losses.SigmoidFocalCrossEntropy()
# model.compile(optimizer='adam',
#               loss={'bbox_output': 'mean_squared_error', 'class_output': focal_loss},
#               metrics={'bbox_output': ['mse'], 'class_output': ['accuracy']})

# # Train the model
# model.fit(train_dataset, epochs=10)

# # Save the model in JSON format
# model_json = model.to_json()
# with open("model.json", "w") as json_file:
#     json_file.write(model_json)
