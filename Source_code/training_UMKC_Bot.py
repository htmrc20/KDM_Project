from rasa_nlu.training_data import load_data
from rasa_nlu.model import Trainer
from rasa_nlu import config
import rasa_nlu
print(rasa_nlu.__version__)
import numpy as np
print(np.__version__)
import yaml
print(yaml.__version__)

config.load('')

#MODELS1 = ['event_data']
MODELS1 =["Tamak's_intents_data"] # ['event_data']

#trainer = Trainer(config.load("configs/config_spacy.yml"))
trainer = Trainer(config.load("configs/config_spacy_for_intent.yml"))
for model_name in MODELS1:
    print('Training for - {} model'.format(model_name))
    training_data = load_data('training_data/data/{}.md'.format(model_name))
    trainer.train(training_data)
    model_directory = trainer.persist('./models/', fixed_model_name=model_name)

print('model training finished.')
