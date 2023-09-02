# import tensorflow as tf
# import tensorflow_datasets as tfds

# coco2017_train = tfds.load('coco/2017', split='train', as_supervised=True)
# coco2017_subset = coco2017_train.shuffle(buffer_size=10000, reshuffle_each_iteration=False).take(5000)

# n_subset_samples = sum(1 for _ in coco2017_subset)
# train_size = int(0.75 * n_subset_samples)
# test_size = n_subset_samples - train_size

# coco2017_train_new = coco2017_subset.take(train_size)
# coco2017_test_new = coco2017_subset.skip(train_size)

# n_train_new_samples = sum(1 for _ in coco2017_train_new)
# n_test_new_samples = sum(1 for _ in coco2017_test_new)

# print(f"Number of subset samples: {n_subset_samples}")
# print(f"Number of new training samples: {n_train_new_samples}")
# print(f"Number of new test samples: {n_test_new_samples}")
